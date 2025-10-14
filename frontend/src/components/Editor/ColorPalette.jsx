import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateColorPalette, clearPalette } from '@/redux/slice/ai/ai.slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Loader, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ColorPalette = () => {
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { palette, loading, error } = useSelector((state) => state.ai);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleGeneratePalette = () => {
    if (imageFile) {
      dispatch(generateColorPalette(imageFile));
    }
  };

  const handleClear = () => {
    setImageFile(null);
    dispatch(clearPalette());
  };

  return (
    <div className="absolute bottom-4 right-4 w-80 z-10">
      <Card className="bg-card/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Palette className="text-primary w-4 h-4" />
            AI Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2 mb-3">
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Button
              onClick={() => fileInputRef.current.click()}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {imageFile ? imageFile.name : 'Select Image'}
            </Button>
            <Button
              onClick={handleGeneratePalette}
              disabled={loading || !imageFile}
              size="sm"
            >
              {loading ? <Loader className="animate-spin w-4 h-4" /> : <Palette className="w-4 h-4" />}
            </Button>
          </div>

          <AnimatePresence>
            {palette && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div>
                  <h4 className="font-medium text-xs mb-1 text-muted-foreground">Primary Colors</h4>
                  <div className="flex gap-1 flex-wrap">
                    {palette.primary.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                        onClick={() => navigator.clipboard.writeText(color)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-xs mb-1 text-muted-foreground">Complementary Colors</h4>
                  <div className="flex gap-1 flex-wrap">
                    {palette.complementary.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                        onClick={() => navigator.clipboard.writeText(color)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-xs mb-1 text-muted-foreground">Full Palette</h4>
                  <div className="flex gap-1 flex-wrap">
                    {palette.fullPalette.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                        onClick={() => navigator.clipboard.writeText(color)}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={handleClear} variant="outline" size="sm" className="w-full">
                  Clear
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="text-destructive text-xs mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorPalette;