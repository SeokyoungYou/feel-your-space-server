import { PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";

const prisma = new PrismaClient();

const typeDefs = gql`
  type Video {
    id: Id
    url: String
    snippet: Snippet
    infos: VideoInfos
  }
  type Id {
    videoId: ID
  }
  type Snippet {
    channelId: ID
    channelThumbnail: String
    title: String
    description: String
    thumbnails: Thumnails
  }
  type VideoInfos {
    contentDetails: ContentDetails
    statistics: Statistics
  }
  type ContentDetails {
    duration: String
  }
  type Statistics {
    viewCount: String
    likeCount: String
  }
  type Thumnails {
    default: Thumnail
    medium: Thumnail
    high: Thumnail
  }
  type Thumnail {
    url: String
    width: Int
    height: Int
  }
  type Query {
    searchVideos(keywords: String[]): [Video]
  }
`;
const resolvers = {
  Query: {
    //1. keyword query를 넣어서 검색 결과물 Video list 가져오기
    async searchVideos(root, { keywords }) {
      return await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keywords.join(
          ""
        )}&type=video&key=${process.env.API_KEY}`
      )
        .then((response) => response.json())
        .then((json) => json.items);
    },
    allVideos: () => {
      return prisma.videosOfKeywords.findMany();
    },
  },
  Video: {
    url(root) {
      return `https://www.youtube.com/watch?v=${root.id.videoId}`;
    },
    //Video list의 각 Video에 추가 정보 가져오기
    async infos(root) {
      return await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${root.id.videoId}&key=${process.env.API_KEY}`
      )
        .then((response) => response.json())
        .then((json) => json.items[0]);
    },
  },
  Snippet: {
    //Video list의 각 Video에 추가 정보 가져오기
    async channelThumbnail({ channelId }) {
      return await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.API_KEY}`
      )
        .then((response) => response.json())
        .then((json) => json.items[0].snippet.thumbnails.default.url);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(` Server ready at ${url}`);
});
