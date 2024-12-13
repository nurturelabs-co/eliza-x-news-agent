import { TwitterManager } from "@ai16z/client-twitter";
import { Provider } from "@ai16z/eliza";
import { getProfileTweets } from "./getNews.js";

let twitterManager: TwitterManager | null = null;

export const setTwitterManager = (manager: unknown) => {
    twitterManager = manager as TwitterManager;
};

export const twitterNewsProvider: Provider = {
    get: async (runtime, message, state) => {
        console.log("Getting news for", message.content.text);
        console.log(JSON.stringify(message));
        // const tweets = await searchTwitterNews("AI Agents");
        // // Randomly select 5 tweets
        // const randomTweets = tweets.sort(() => 0.5 - Math.random()).slice(0, 5);
        // console.log("Random 5 tweets:", randomTweets);
        try {
            const tweets =
                await twitterManager.client.twitterClient.fetchHomeTimeline(
                    20,
                    []
                );
            const now = Date.now();
            const oneDayAgo = now - 24 * 60 * 60 * 1000;
            const filteredTweets = tweets
                .map((tweet) => ({
                    tweet_id: tweet.legacy?.id_str,
                    username:
                        tweet?.core?.user_results?.result?.legacy?.screen_name,
                    tweet_url: `https://x.com/${tweet?.core?.user_results?.result?.legacy?.screen_name}/status/${tweet.legacy?.id_str}`,
                    text: tweet.legacy.full_text,
                    timestamp: new Date(tweet.legacy?.created_at).getTime(),
                    favorite_count: tweet.legacy?.favorite_count,
                    retweet_count: tweet.legacy?.retweet_count,
                    reply_count: tweet.legacy?.reply_count,
                }))
                .filter(
                    (tweet) =>
                        tweet.favorite_count > 50 &&
                        tweet.retweet_count > 20 &&
                        tweet.reply_count > 5 &&
                        tweet.timestamp > oneDayAgo
                )
                .sort((a, b) => b.timestamp - a.timestamp);
            return `Here are some of the latest tweets about AI Agents: ${JSON.stringify(filteredTweets)}`;
        } catch (error) {
            console.error("Error fetching tweets:", error);
            throw error;
        }
    },
};

export const twitterPostsProvider: Provider = {
    get: async (runtime, message, state) => {
        console.log("Getting posts for", message.content.text);
        console.log(JSON.stringify(message));
        try {
            if (!twitterManager) {
                return "Twitter client not initialized";
            }

            const tweets = await getProfileTweets("agentopiadotxyz");
            return `Here are your recent tweets: ${JSON.stringify(tweets)}\n`;
        } catch (error) {
            console.error("Error fetching self tweets:", error);
            throw error;
        }
    },
};
