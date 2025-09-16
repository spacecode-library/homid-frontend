export const DotsLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-[#3B82F6FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-[#3B82F6FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-[#3B82F6FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};