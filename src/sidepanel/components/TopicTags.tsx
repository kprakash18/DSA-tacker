interface TopicTagsProps {
  tags?: string[];
  maxTags?: number;
  className?: string;
}

export default function TopicTags({ tags, maxTags = 3, className = "" }: TopicTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const visibleTags = tags.slice(0, maxTags);
  const extraCount = tags.length - maxTags;

  return (
    <div className={`flex flex-wrap items-center gap-1 mt-1 ${className}`}>
      {visibleTags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200/60"
        >
          {tag}
        </span>
      ))}
      {extraCount > 0 && (
        <span className="text-[10px] font-medium text-gray-400">
          +{extraCount}
        </span>
      )}
    </div>
  );
}
