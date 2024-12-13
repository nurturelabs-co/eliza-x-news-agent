export async function searchTwitterNews(
    query,
    // token: string
) {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        const url = `https://twitter154.p.rapidapi.com/search/search?query=${encodeURIComponent(query)}&section=latest&min_retweets=10&min_likes=50&limit=20&min_replies=5&start_date=${yesterdayString}&language=en`;

        const response = await fetch(url, {
            headers: {
                // Authorization: `Bearer ${token}`,
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": "twitter154.p.rapidapi.com",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Twitter API error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        // Extract relevant properties from each tweet
        const parsedTweets = data.results.map(tweet => ({
            tweet_id: tweet.tweet_id,
            creation_date: tweet.creation_date,
            text: tweet.text,
            tweet_url: `https://x.com/${tweet?.user?.username}/status/${tweet.tweet_id}`,
            user: tweet.user && {
                username: tweet.user.username,
                name: tweet.user.name,
                follower_count: tweet.user.follower_count,
                description: tweet.user.description
            },
            favorite_count: tweet.favorite_count,
            retweet_count: tweet.retweet_count,
            reply_count: tweet.reply_count,
            views: tweet.views || 0
        }));
        return parsedTweets;
    } catch (error) {
        // elizaLogger.error("Error searching Twitter news:", error);
        throw error;
    }
}

export async function getProfileTweets(
    username,
    limit = 10,
    includeReplies = false,
    includePinned = false
) {
    try {
        const url = `https://twitter154.p.rapidapi.com/user/tweets?username=${username}&limit=${limit}&include_replies=${includeReplies}&include_pinned=${includePinned}`;

        const response = await fetch(url, {
            headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": "twitter154.p.rapidapi.com",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Twitter API error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        // Extract relevant properties from each tweet
        const parsedTweets = data.results.map(tweet => ({
            tweet_id: tweet.tweet_id,
            // creation_date: tweet.creation_date,
            text: tweet.text,
            // tweet_url: `https://x.com/${tweet?.user?.username}/status/${tweet.tweet_id}`,
            // favorite_count: tweet.favorite_count,
            // retweet_count: tweet.retweet_count,
            // reply_count: tweet.reply_count,
            // views: tweet.views || 0
        }));
        return parsedTweets;
    } catch (error) {
        throw error;
    }
}
