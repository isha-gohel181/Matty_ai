import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDesignSuggestions } from '@/redux/slice/ai/ai.slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Loader, Lightbulb, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiSuggestions = ({ onApplyTemplate }) => {
  const [prompt, setPrompt] = useState('');
  const [generateTemplate, setGenerateTemplate] = useState(false);
  const dispatch = useDispatch();
  const { suggestions, template, loading, error } = useSelector((state) => state.ai);

  const handleGetSuggestions = () => {
    if (prompt.trim()) {
      dispatch(getDesignSuggestions({ prompt, generateTemplate }));
    }
  };

  const handleApplyTemplate = () => {
    if (template && onApplyTemplate) {
      onApplyTemplate(template);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 w-72 z-10">
      <Card className="bg-card/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="text-primary w-4 h-4" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Describe your design..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestions()}
              className="text-sm"
            />
            <Button onClick={handleGetSuggestions} disabled={loading} size="sm">
              {loading ? <Loader className="animate-spin w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <Checkbox
              id="generate-template"
              checked={generateTemplate}
              onCheckedChange={setGenerateTemplate}
            />
            <label
              htmlFor="generate-template"
              className="text-xs text-muted-foreground cursor-pointer"
            >
              Generate complete template
            </label>
          </div>
          
          <AnimatePresence>
            {suggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div>
                  <h4 className="font-medium text-xs mb-1 text-muted-foreground">Colors</h4>
                  <div className="flex gap-1">
                    {suggestions.palette.map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-xs mb-1 text-muted-foreground">Fonts</h4>
                  <div className="text-xs space-y-1">
                    <p><strong>H:</strong> {suggestions.fonts.heading}</p>
                    <p><strong>B:</strong> {suggestions.fonts.body}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-xs mb-1 text-muted-foreground">Layout</h4>
                  <p className="text-xs italic">"{suggestions.layout}"</p>
                </div>

                {template && (
                  <div className="pt-2 border-t border-border">
                    <Button
                      onClick={handleApplyTemplate}
                      size="sm"
                      className="w-full"
                      variant="default"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Apply Template
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="text-destructive text-xs mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AiSuggestions;