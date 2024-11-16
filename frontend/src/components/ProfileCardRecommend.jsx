import React from 'react';

const ProfileCardRecommend = ({ user }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            {/* Header */}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {user.cardContent.header.username}
                    </h3>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                        Match: {user.cardContent.header.matchScore}
                    </span>
                </div>
                <p className="text-gray-400">{user.cardContent.header.college}</p>
            </div>

            {/* Skills */}
            <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {user.cardContent.body.skills.map((skill, index) => (
                        <span 
                            key={index}
                            className="bg-gray-700 text-white px-2 py-1 rounded-md text-sm"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Experience */}
            <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Experience</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400">Hackathons</p>
                        <p className="text-white font-bold">
                            {user.cardContent.body.experience.hackathons}
                        </p>
                    </div>
                </div>
            </div>

            {/* GitHub Stats */}
            <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">GitHub Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400">Repositories</p>
                        <p className="text-white font-bold">
                            {user.cardContent.body.experience.githubStats.repos}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400">Contributions</p>
                        <p className="text-white font-bold">
                            {user.cardContent.body.experience.githubStats.contributions}
                        </p>
                    </div>
                </div>
            </div>

            {/* Similarity Metrics */}
            <div className="border-t border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-400">Skill Match</p>
                        <p className="text-white font-bold">
                            {user.cardContent.footer.similarityMetrics.skillMatch}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400">Experience Match</p>
                        <p className="text-white font-bold">
                            {user.cardContent.footer.similarityMetrics.experienceMatch}
                        </p>
                    </div>
                </div>
            </div>

            {/* Connect Button */}
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                Connect
            </button>
        </div>
    );
};

export default ProfileCardRecommend;