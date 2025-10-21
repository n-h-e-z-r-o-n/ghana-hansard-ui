'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface CardData {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  date: string;
  author: string;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface MobileOptimizedCardProps {
  data: CardData;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onShare?: (id: string) => void;
  onView?: (id: string) => void;
  className?: string;
}

export default function MobileOptimizedCard({
  data,
  onLike,
  onBookmark,
  onShare,
  onView,
  className = ''
}: MobileOptimizedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(data.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(data.isBookmarked || false);
  const [likes, setLikes] = useState(data.likes);
  const [showActions, setShowActions] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swipe right - like
      handleLike();
    } else if (info.offset.x < -threshold) {
      // Swipe left - bookmark
      handleBookmark();
    }
    
    // Reset position
    x.set(0);
    y.set(0);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(data.id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(data.id);
  };

  const handleShare = () => {
    onShare?.(data.id);
  };

  const handleView = () => {
    onView?.(data.id);
  };

  const handleTap = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleDoubleTap = () => {
    handleLike();
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
      onTap={handleTap}
      onDoubleTap={handleDoubleTap}
    >
      {/* Swipe Indicators */}
      <motion.div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
        style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
      >
        <div className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
          Like
        </div>
      </motion.div>
      
      <motion.div
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
        style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
      >
        <div className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
          Bookmark
        </div>
      </motion.div>

      {/* Main Card */}
      <motion.div
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        layout
        transition={{ duration: 0.3 }}
      >
        {/* Card Header */}
        <div className="relative">
          {data.image && (
            <div className="h-48 bg-gradient-to-br from-red-100 to-green-100 relative overflow-hidden">
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
              {data.category}
            </span>
          </div>

          {/* Action Menu */}
          <div className="absolute top-4 right-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowActions(!showActions)}
              className="p-2 bg-white bg-opacity-90 rounded-full shadow-md"
            >
              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {data.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{data.author}</span>
                <span>•</span>
                <span>{data.date}</span>
              </div>
            </div>
          </div>

          <p className={`text-gray-600 leading-relaxed transition-all duration-300 ${
            isExpanded ? 'line-clamp-none' : 'line-clamp-3'
          }`}>
            {data.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{likes}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isBookmarked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookmarkIcon className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ShareIcon className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleView}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Expanded Actions Menu */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-48"
          >
            <motion.button
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => {
                handleLike();
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
            >
              {isLiked ? (
                <HeartSolidIcon className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              <span>{isLiked ? 'Unlike' : 'Like'}</span>
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => {
                handleBookmark();
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
            >
              <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'text-blue-500' : ''}`} />
              <span>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</span>
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => {
                handleShare();
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
            >
              <ShareIcon className="w-4 h-4" />
              <span>Share</span>
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => {
                handleView();
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              View Full Details
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Touch Instructions */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Tap to expand • Double tap to like • Swipe right to like • Swipe left to bookmark
        </p>
      </div>
    </motion.div>
  );
}

// Mobile-optimized card grid component
export function MobileCardGrid({ 
  cards, 
  onCardAction 
}: { 
  cards: CardData[];
  onCardAction: (action: string, id: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleCardAction = (action: string, id: string) => {
    onCardAction(action, id);
  };

  return (
    <div className="relative">
      {/* Card Navigation */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="p-2 bg-white rounded-full shadow-md border border-gray-200"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </motion.button>

        <div className="flex space-x-2">
          {cards.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-red-600' : 'bg-gray-300'
              }`}
              animate={{ scale: index === currentIndex ? 1.2 : 1 }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="p-2 bg-white rounded-full shadow-md border border-gray-200"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-600" />
        </motion.button>
      </div>

      {/* Card Display */}
      <div className="relative h-96 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <MobileOptimizedCard
              data={cards[currentIndex]}
              onLike={(id) => handleCardAction('like', id)}
              onBookmark={(id) => handleCardAction('bookmark', id)}
              onShare={(id) => handleCardAction('share', id)}
              onView={(id) => handleCardAction('view', id)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
