// Debug-friendly popup preload for extension popup
// - logs when loaded
// - installs window error / unhandledRejection handlers
// - checks DOMContentLoaded and presence of #root
// - injects a visible debug marker into #root if nothing renders
// - preserves the original XLSX helper functions you had

(function () {
  try {
    console.log('[popup-preload] loaded');

    // Global error handlers so we don't miss anything
    window.addEventListener('error', function (ev) {
      try {
        console.error('[popup-preload] window error', ev.error || ev.message || ev);
      } catch (e) {
        // swallow, but not silently in devtools
        console.log('[popup-preload] error logging failed', e);
      }
    });

    window.addEventListener('unhandledrejection', function (ev) {
      try {
        console.error('[popup-preload] unhandledrejection', ev.reason);
      } catch (e) {
        console.log('[popup-preload] unhandledrejection logging failed', e);
      }
    });

    document.addEventListener('DOMContentLoaded', function () {
      try {
        console.log('[popup-preload] DOMContentLoaded, #root present?', !!document.getElementById('root'));
      } catch (e) {
        console.error('[popup-preload] DOMContentLoaded handler error', e);
      }
    });

    // Small visibility marker to show the popup is at least running this preload code.
    // It will be removed automatically if your React app replaces #root children.
    function ensureDebugMarker() {
      try {
        var root = document.getElementById('root');
        if (!root) {
          console.warn('[popup-preload] #root not found');
          return;
        }
        // Don't stomp existing app content
        if (!root.hasChildNodes()) {
          var marker = document.createElement('div');
          marker.id = '__popup-debug-marker';
          marker.textContent = 'DEBUG: popup-preload ran — waiting for bundle...';
          marker.style.cssText = 'padding:8px;background:#ffe6e6;color:#111;border:1px solid #ff9; font-family: sans-serif';
          root.appendChild(marker);
          console.log('[popup-preload] debug marker injected into #root');
        } else {
          console.log('[popup-preload] #root already has children (bundle may have rendered).');
        }
      } catch (e) {
        console.error('[popup-preload] ensureDebugMarker error', e);
      }
    }

    // Run after a short delay to allow bundle to run if it runs synchronously right after our script.
    setTimeout(function () {
      try {
        // Are there children yet?
        var root = document.getElementById('root');
        console.log('[popup-preload] setTimeout check — #root children:', root ? root.childElementCount : 'no #root');
        if (root && root.childElementCount === 0) {
          // Install a second check after a little more time; helpful for async bundles or React hydration.
          ensureDebugMarker();
          setTimeout(function () {
            try {
              console.log('[popup-preload] second check — #root children:', root.childElementCount);
              if (0 === root.childElementCount) {
                // If still empty, print a helpful hint
                console.warn('[popup-preload] After 2 checks, #root still empty. This indicates the bundle may not have executed or rendered. See checklist in extension popup devtools console.');
              } else {
                // If bundle later rendered, remove marker if present
                var m = document.getElementById('__popup-debug-marker');
                if (m) {
                  m.remove();
                  console.log('[popup-preload] debug marker removed because bundle rendered children.');
                }
              }
            } catch (e) {
              console.error('[popup-preload] second check error', e);
            }
          }, 1200);
        } else if (root && root.childElementCount > 0) {
          // If something already rendered, don't bother with marker
          var m = document.getElementById('__popup-debug-marker');
          if (m) {
            m.remove();
            console.log('[popup-preload] removed debug marker because root already has children');
          }
        }
      } catch (e) {
        console.error('[popup-preload] initial setTimeout error', e);
      }
    }, 300);

    // --- Your original XLSX helper code (kept as-is) ---
    // If you need to customize, it's safe to edit below.
    var gk_isXlsx = false;
    var gk_xlsxFileLookup = {};
    var gk_fileData = {};

    function filledCell(cell) {
      return cell !== '' && cell != null;
    }

    function loadFileData(filename) {
      if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
          var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
          var firstSheetName = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[firstSheetName];

          // Convert sheet to JSON to filter blank rows
          var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
          // Filter out blank rows (rows where all cells are empty, null, or undefined)
          var filteredData = jsonData.filter(row => row.some(filledCell));

          // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
          var headerRowIndex = filteredData.findIndex((row, index) =>
            row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
          );
          // Fallback
          if (headerRowIndex === -1 || headerRowIndex > 25) {
            headerRowIndex = 0;
          }

          // Convert filtered JSON back to CSV
          var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
          csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
          return csv;
        } catch (e) {
          console.error('[popup-preload] loadFileData error', e);
          return "";
        }
      }
      return gk_fileData[filename] || "";
    }
    // --- end preserved code ---
  } catch (e) {
    console.error('[popup-preload] top-level error', e);
  }
})();
