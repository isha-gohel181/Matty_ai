import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTemplates } from "@/redux/slice/template/template.slice";
import { addToFavorites, removeFromFavorites, checkFavorite } from "@/redux/slice/favorite/favorite.slice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { LayoutTemplate, Search, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TemplatesPage = () => {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector((state) => state.template);
  const { favoriteStatus, loading: favoriteLoading } = useSelector((state) => state.favorite);
  const { user } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleFavorite = (templateId) => {
    if (!user) return;
    if (favoriteStatus[templateId]) {
      dispatch(removeFromFavorites(templateId));
    } else {
      dispatch(addToFavorites(templateId));
    }
  };

  const handleShare = async (template) => {
    const shareUrl = `${window.location.origin}/dashboard/editor?template=${template._id}`;
    const shareText = `Check out this template: ${template.title}`;
    const shareImage = template.thumbnailUrl.secure_url;

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: template.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }

    // Fallback: Create a share menu with social platforms
    const shareOptions = [
      {
        name: 'WhatsApp',
        url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
      },
      {
        name: 'Facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
      },
      {
        name: 'Twitter',
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
      },
      {
        name: 'LinkedIn',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
      },
      {
        name: 'Copy Link',
        action: () => {
          navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        }
      }
    ];

    // Create a simple share menu
    const shareMenu = document.createElement('div');
    shareMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    shareMenu.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Share "${template.title}"</h3>
        <div class="space-y-2">
          ${shareOptions.map(option => `
            <button class="share-option w-full text-left p-3 rounded hover:bg-gray-100 transition-colors" data-name="${option.name}">
              ${option.name}
            </button>
          `).join('')}
        </div>
        <button class="cancel-share mt-4 w-full p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
          Cancel
        </button>
      </div>
    `;

    document.body.appendChild(shareMenu);

    // Add event listeners
    shareMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('cancel-share') || e.target === shareMenu) {
        document.body.removeChild(shareMenu);
        return;
      }

      const optionName = e.target.dataset.name;
      const option = shareOptions.find(opt => opt.name === optionName);
      
      if (option) {
        if (option.action) {
          option.action();
        } else {
          window.open(option.url, '_blank', 'noopener,noreferrer');
        }
        document.body.removeChild(shareMenu);
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const filters = {};
    if (debouncedSearch) filters.search = debouncedSearch;
    if (category && category !== "all") filters.category = category;
    dispatch(getTemplates(filters));
  }, [dispatch, debouncedSearch, category]);

  useEffect(() => {
    if (user && templates.length > 0) {
      templates.forEach(template => {
        dispatch(checkFavorite(template._id));
      });
    }
  }, [dispatch, user, templates]);

  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Templates</h1>
      
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {templates.length === 0 && !loading ? (
        <div className="text-center py-20 flex flex-col items-center">
          <LayoutTemplate className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">No Templates Found</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            There are no templates available at the moment. If you are an admin, you can create new templates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <motion.div
              key={template._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-0 relative">
                  <Link to={`/dashboard/editor?template=${template._id}`}>
                    <img
                      src={template.thumbnailUrl.secure_url}
                      alt={template.title}
                      className="rounded-t-lg aspect-video object-cover"
                    />
                  </Link>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFavorite(template._id);
                      }}
                      disabled={favoriteLoading}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favoriteStatus[template._id] ? "fill-red-500 text-red-500" : "text-gray-500"
                        }`}
                      />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-12 bg-white/80 hover:bg-white/90"
                    onClick={(e) => {
                      e.preventDefault();
                      handleShare(template);
                    }}
                  >
                    <Share2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </CardContent>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{template.category}</p>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;