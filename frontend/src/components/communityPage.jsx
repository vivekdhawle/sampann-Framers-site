import { useEffect, useState } from "react";
import "../App.css";
import { useSelector } from "react-redux";

function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState({}); // ✅ Track liked state
    const [error, setError] = useState(null);
    const updateCount = useSelector(state => state.auth.updateCount);

    const getAllPosts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/posts/seeallpost");
            if (!response.ok) {
                throw new Error(`Something went wrong: ${response.status}`);
            }
            const result = await response.json();
            console.log("API Response:", result);

            if (result.success && result.data && Array.isArray(result.data.posts)) {
                setPosts(result.data.posts.slice().reverse());

                // Initialize liked state
                const initialLikes = {};
                result.data.posts.forEach(post => {
                    initialLikes[post._id] = false;
                });
                setLikedPosts(initialLikes);
            } else {
                throw new Error(result.message || "Unknown error");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        getAllPosts();
    }, [updateCount]);

    // ✅ Toggle like state
    const handleLike = (postId) => {
        setLikedPosts(prevLikes => ({
            ...prevLikes,
            [postId]: !prevLikes[postId],
        }));
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col items-center">
            {error && <p className="text-red-500 text-lg mb-4">Error: {error}</p>}
            
            <div className="w-full max-w-4xl flex flex-col items-center gap-6">
                {posts.length === 0 ? (
                    <p className="text-center text-lg">No posts available</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
                            {/* User Info */}
                            <div className="flex items-center mb-4 w-full">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0"></div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold">{post.owner?.username || "Unknown User"}</h3>
                                </div>
                            </div>

                            {/* Post Image */}
                            {post.postImage ? (
                                <img
                                    src={post.postImage}
                                    alt={post.caption}
                                    className="w-full h-auto max-h-96 object-cover rounded-lg mb-4"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-gray-400 rounded-lg mb-4">
                                    No Image Available
                                </div>
                            )}

                            {/* Post Caption */}
                            <p className="text-sm mb-4 text-center">{post.caption}</p>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-auto w-full">
                                {/* ✅ Like Button with Animation */}
                                <button 
                                    className={`like-button ${likedPosts[post._id] ? "liked" : ""}`} 
                                    onClick={() => handleLike(post._id)}
                                >
                                    {likedPosts[post._id] ? "❤️ Liked" : "🤍 Like"}
                                </button>

                                <span className="text-gray-400 text-sm">2 hours ago</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommunityPage;
