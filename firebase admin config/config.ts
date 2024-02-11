import admin from "firebase-admin";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp({
  credential: cert({
    clientEmail:
      "firebase-adminsdk-dape5@igotyou-399523.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDS0uS4Tz0d18i8\nEFMS8MY8mIJxnyuoOlyrnoz5U+qp4bqRHHuP3lq7eDNRS1cLW/J606ziivs8SPLW\n95XzU0rSSngDRjFNNz/PpeEKeBmCSEopjNDuB9RvIFjl/hM3XOZIUJj4YHfi27KZ\n7zMe3NAeVkn52KG7W+1p5rr3Gla4jFSCfu473nkHv5CFMY0tx4xSgeFEtbOzd4HH\nytQwl2cD52lSctRmelGc/Uw8Tu9Xb/1BwiX/9vbnoWF6/NIKJ8BxdFrQg5DZQme0\ngdtA1Tx7cmwZzuCHE38+GE2p78sVtu6QoRKkNttCFi2ZqVuH9pOJ0nmNkLD6lr1n\nBM3ijCUtAgMBAAECggEAATlsZfluAqiVdlhPj4678W+B1+BCFA4o5G4RyOC0eHvR\nJiPEbqhRgQa/z1yjx/6yeWJnOAfxOgUUbn3K9C55yLbxXEve6+ExNonP2BIhHZzM\n3ABGqoSqH0tE7rZyssG+w7PtNgmASi+ohowNqHJcd/RE92/LN48wstBszLcEwrnd\nvpNJ0WnIrfT92YmnJXRFHBk3VUPEW1Vol7XMwV+TxYacHn8/VCkmeE70u3uwhRe2\nMcq48eRUePI7ukFUOm18rGERXxSOC9vwEEdVotRBBviyX8X1vlHc3MmU/SpTuIMZ\nSglTkaJ2D6M07CqT8xaoY7EaqlFhC3v0wxvkKNI+4wKBgQDzxFH3i/C22C+NOPwk\nm0zyChvHa74a2bkUKRQJNvQdUjR3TvI6QLfgWzEfWxafSwBPIucOxmyQs6Nr3ew6\nUdBLLfel9O3RBhhZ2S+BiSLbONeBgHYGQcJ6ci9zSu8kpzQAbZBg3DMuVJCpBxdZ\nuCuMfvNApnda6DtDDdsNeYJUNwKBgQDdZ1pJGko26PFWzrLaonbr2iw1WMr35mga\n3eRfPI4/Muzg0fBwOwXc6Cwm1hzipZSyNxDF6VelJ1Fu4S1f1zrdNxCEse5UgVO/\nn71L0YOyluaxK3Onufp2T2rKw780pmaRhxaV7HBbv1Or8jT7lbibH8I2JG6b524d\nknqQFP3nuwKBgQCPTWceTq8o3jg+HjTkVEPMujKQbn9oi3vpJSj5LcwefJgJV2jA\n5BD0nMdo9oR7Cn1ZCFyq6+0gt+onXGQl+LipqZE/h5hS2/FuyGXMEdFi7KyMHffE\nP95TW1MXxQKHGqBQbBiHSIvx/Za5N0j73nADfRIFfJcH4yQLjFatOjRqywKBgBLu\nl4XQva/cU2a83gZcBhc83LLjGNgB170UZEbQgslcrWy8BvdR1LqDD+NyQ54N0p06\noDCMN3Zj2k7E6oBbgykPYFY4cMzBEkw8eI9XJw/KX4ee05DwEj6zo8oa2urBn9up\n1YCUazctMRZu66DnuJVrLcw7aUnjjELzF4/ie6OpAoGAfsrN5UtvhBu+0H2V2o09\nnkIZQBvqyH1KtGXqxYdfW0P1eE9zzGan4gu5nJoQ+muJRERdK4+/+naqwBFDIEY2\nckwaxXyQZPB6ktFa22wX01Jc37u3cF8hZtrfP6WZxUicW2VwK50VQocqWWQHbFLC\na/0EGz9QgQMsaNv3nJ1YbIs=\n-----END PRIVATE KEY-----\n".replace(
        /\\n/g,
        "\n"
      ),
    projectId: "igotyou-399523",
  }),
});

export const auth = getAuth(app);
