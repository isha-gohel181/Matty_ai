import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getMyDesigns,
  deleteDesign,
} from "@/redux/slice/design/design.slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const DashboardFile = () => {
  const dispatch = useDispatch();
  const { designs, loading } = useSelector((state) => state.design);

  useEffect(() => {
    dispatch(getMyDesigns());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      dispatch(deleteDesign(id));
    }
  };

  if (loading && designs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Designs</h1>
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
                <CardFooter className="flex justify-between items-center p-4">
                  <span className="font-semibold truncate">{design.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(design._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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