import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server";

const client = new PrismaClient();
//create a user
client.videosOfKeywords.create(gql`
searchVideos() {
    infos {
      contentDetails {
        duration
      }
      statistics {
        viewCount
        likeCount
      }
    }
    url
    id {
      videoId
    }
    snippet {
      channelId
      channelThumbnail
      title
      description
      thumbnails {
        default {
          url
          width
          height
        }
        medium {
          url
          width
          height
        }
        high {
          url
          width
          height
        }
      }
    }
  }
`);
