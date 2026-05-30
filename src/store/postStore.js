import Storage, { uid, nowISO } from "./storage";

const PostStore = {
  async create({ userId, userName, prompt, postType, tone, platforms, results }) {
    const id   = uid();
    const post = {
      id, userId, userName,
      prompt, postType, tone,
      platforms, results,
      status: "published",
      createdAt: nowISO(),
    };
    await Storage.set(`posts:${id}`, post);
    const idx = (await Storage.get("posts:index")) || [];
    idx.unshift(id);
    await Storage.set("posts:index", idx);
    return post;
  },

  async list() {
    const idx   = (await Storage.get("posts:index")) || [];
    const posts = await Promise.all(idx.map(id => Storage.get(`posts:${id}`)));
    return posts.filter(Boolean);
  },

  async delete(id) {
    await Storage.del(`posts:${id}`);
    const idx = (await Storage.get("posts:index")) || [];
    await Storage.set("posts:index", idx.filter(i => i !== id));
    return true;
  },

  async updateStatus(id, status) {
    const post = await Storage.get(`posts:${id}`);
    if (!post) return false;
    post.status = status;
    await Storage.set(`posts:${id}`, post);
    return post;
  },
};

export default PostStore;
