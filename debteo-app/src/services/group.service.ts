import api from "../api";

export async function createGroup({
  name,
  avatarUrl,
  members
}: {
  name: string;
  avatarUrl?: string;
  members: { displayName: string }[]
}) {
    const res = await api.post("/groups", {name, avatarUrl, members},);
    return res.data; 
}

export async function getMyGroups() {
  const res = await api.get("/groups", {});
  return res.data;
}

export async function getGroupById(id: string) {
  const res = await api.get(`/groups/${id}`, {
    headers: { "Cache-Control": "no-cache" }
  });
  return res.data;
}

export async function deleteGroup(id: string) {
  const res = await api.delete(`/groups/${id}`, {
    headers: { "Cache-Control": "no-cache" }
  });
  return res.data;
}


export async function leaveGroup(id: string) {
  const res = await api.get(`/groups/${id}/leave`, {
    headers: { "Cache-Control": "no-cache" }
  });
  return res.data;
}

export async function addMembers(id: string) {
  const res = await api.get(`/groups/${id}/add-members`, {
    headers: { "Cache-Control": "no-cache" }
  });
  return res.data;
}

