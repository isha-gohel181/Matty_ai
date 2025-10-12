import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getMyDesigns,
  deleteDesign,
} from "@/redux/slice/design/design.slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const DashboardFile = () => {
  const dispatch = useDispatch();
  const { designs, loading } = useSelector((state) => state.design);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getMyDesigns(searchQuery));
  }, [dispatch, searchQuery]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      dispatch(deleteDesign(id));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleShare = async (design) => {
    const shareUrl = `${window.location.origin}/dashboard/editor/${design._id}`;
    const shareText = `Check out my design: ${design.title}`;
    const shareImage = design.thumbnailUrl.secure_url;

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: design.title,
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
        <h3 class="text-lg font-semibold mb-4">Share "${design.title}"</h3>
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

  if (loading && designs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Designs</h1>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search designs by title or tags..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 w-full md:max-w-md"
        />
      </div>
      
      {designs.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No designs yet!</h2>
          <p className="text-muted-foreground mt-2">
            Click the button below to start creating.
          </p>
          <Button asChild className="mt-6">
            <Link to="/dashboard/editor">Create New Design</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {designs.map((design) => (
            <motion.div
              key={design._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-0">
                  <Link to={`/dashboard/editor/${design._id}`}>
                    <img
                      src={design.thumbnailUrl.secure_url}
                      alt={design.title}
                      className="rounded-t-lg aspect-video object-cover"
                    />
                  </Link>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 gap-2">
                  <span className="font-semibold truncate w-full">{design.title}</span>
                  {design.tags && design.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {design.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end w-full gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare(design)}
                      title="Share design"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(design._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardFile;