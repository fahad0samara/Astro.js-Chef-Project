import React, {useEffect, useState} from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then(response => response.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {images.map(image => (
          <div key={image.id} className="flex flex-col items-center">
            <img
              src={image.thumbnailUrl}
              alt={image.title}
              className="w-40 h-40 object-cover"
            />
            <p className="mt-2">{image.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
