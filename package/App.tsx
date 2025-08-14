import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { ScrollArea } from './components/ui/scroll-area';
import { BookOpen, Download, Settings, Check, AlertCircle } from 'lucide-react';

type Highlight = { text: string };

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [titleProperty, setTitleProperty] = useState('Título do Livro');
  const [authorProperty, setAuthorProperty] = useState('Autor');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['token', 'databaseId', 'titleProperty', 'authorProperty'], (result) => {
      setToken(result.token || '');
      setDatabaseId(result.databaseId || '');
      setTitleProperty(result.titleProperty || 'Título do Livro');
      setAuthorProperty(result.authorProperty || 'Autor');
    });
  }, []);

  const saveSettings = () => {
    if (!databaseId.match(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i)) {
      setExportStatus('Error: Invalid Database ID format');
      return;
    }
    if (!titleProperty || !authorProperty) {
      setExportStatus('Error: Title and Author property names are required');
      return;
    }
    chrome.storage.local.set({ token, databaseId, titleProperty, authorProperty }, () => {
      setExportStatus('Settings saved!');
    });
  };

  const exportToNotion = () => {
    setIsExporting(true);
    setExportStatus('Exporting...');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) {
        setIsExporting(false);
        setExportStatus('Error: No active tab found');
        return;
      }
      const tab = tabs[0];
      if (typeof tab.url === 'string' && (tab.url.startsWith('https://ler.amazon.com.br/notebook') || tab.url.startsWith('https://read.amazon.com/notebook'))) {
        if (typeof tab.id === 'number') {
          chrome.tabs.sendMessage(tab.id, { action: 'export' }, (response) => {
            setIsExporting(false);
            if (chrome.runtime.lastError) {
              setExportStatus('Error: Could not connect to content script');
            } else if (response && response.status) {
              setExportStatus(response.status);
            } else {
              setExportStatus('Error: Invalid response');
            }
          });
        } else {
          setIsExporting(false);
          setExportStatus('Error: Tab id is undefined');
        }
      } else {
        setIsExporting(false);
        setExportStatus('Error: Not on a Kindle notes page');
      }
    });
  };

  const fetchHighlights = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || typeof tabs[0].id !== 'number') return;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getHighlights' }, (response) => {
        if (response && response.highlights) {
          setHighlights(response.highlights);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kindle2Notion</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings"><Settings size={16} /> Settings</TabsTrigger>
            <TabsTrigger value="highlights"><BookOpen size={16} /> Highlights</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            <Label htmlFor="token">Notion Token</Label>
            <Input id="token" value={token} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)} />
            <Label htmlFor="databaseId">Database ID</Label>
            <Input id="databaseId" value={databaseId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatabaseId(e.target.value)} />
            <Label htmlFor="titleProperty">Title Property</Label>
            <Input id="titleProperty" value={titleProperty} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitleProperty(e.target.value)} />
            <Label htmlFor="authorProperty">Author Property</Label>
            <Input id="authorProperty" value={authorProperty} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthorProperty(e.target.value)} />
            <Button onClick={saveSettings}>Save Settings</Button>
          </TabsContent>
          <TabsContent value="highlights">
            <Button onClick={fetchHighlights}>Load Highlights</Button>
            <ScrollArea>
              {highlights.map((h, index) => (
                <Alert key={index}>
                  <AlertDescription>{h.text}</AlertDescription>
                </Alert>
              ))}
            </ScrollArea>
            <Button onClick={exportToNotion} disabled={isExporting}>Export</Button>
            {exportStatus && <Alert><AlertDescription>{exportStatus}</AlertDescription></Alert>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default App;
