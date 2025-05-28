import React from 'react';
import { StarFilled } from '@ant-design/icons';

interface StarRatingProps {
    rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const fractional = rating - fullStars;
    const percent = Math.round(fractional * 100);

    return (
        <div style={{ display: 'inline-flex', gap: 2, alignItems: 'center', lineHeight: 1 }}>
            {Array.from({ length: 5 }).map((_, index) => {
                if (index < fullStars) {
                    return <StarFilled key={index} style={{ color: '#fadb14', fontSize: 16, lineHeight: 1 }} />;
                } else if (index === fullStars && fractional > 0) {
                    return (
                        <div
                            key={index}
                            style={{
                                position: 'relative',
                                width: 16,
                                height: 16,
                                display: 'inline-block',
                                lineHeight: 1,
                            }}
                        >
                            <StarFilled style={{ color: '#e9e9e9', position: 'absolute', top: 0, left: 0, fontSize: 16 }} />
                            <StarFilled
                                style={{
                                    color: '#fadb14',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    fontSize: 16,
                                    clipPath: `inset(0 ${100 - percent}% 0 0)`,
                                }}
                            />
                        </div>
                    );
                } else {
                    return <StarFilled key={index} style={{ color: '#e9e9e9', fontSize: 16, lineHeight: 1 }} />;
                }
            })}
        </div>
    );
};


export default StarRating;
