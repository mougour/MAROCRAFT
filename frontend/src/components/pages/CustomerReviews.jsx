import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ChevronLeft,
  Search,
  MessageSquare,
  Clock,
} from 'lucide-react';
import axios from 'axios';
import { useUserAuth } from '../../UserAuthContext';

const CustomerReviews = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();

  // Fetch reviews from API using axios
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/user/${user._id}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchReviews();
  }, [user?._id]);

  // Define filter options
  const filters = [
    { label: 'All Reviews', value: 'all' },
    { label: '5 Stars', value: '5' },
    { label: '4 Stars', value: '4' },
    { label: '3 Stars', value: '3' },
    { label: '2 Stars', value: '2' },
    { label: '1 Star', value: '1' },
  ];

  // Filter reviews based on selected filter and search query
  const filteredReviews = reviews.filter((review) => {
    if (selectedFilter !== 'all' && review.rating !== parseInt(selectedFilter)) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        review.productId?.name?.toLowerCase().includes(searchLower) ||
        review.comment?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/customer-dash"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reviews Given
          </h1>
          <p className="text-base text-gray-600">
            View and manage all your product reviews
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base bg-white shadow-sm"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedFilter === filter.value
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <MessageSquare size={20} className="text-amber-800" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {review.productId?.name || 'Product'}
                      </h3>
                      <div className="flex items-center">
                        {Array(review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5 text-amber-400 fill-current"
                            />
                          ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2 mb-3">
                      {review.comment}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 text-lg">No reviews match your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews; 