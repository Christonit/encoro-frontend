import { AxiosResponse } from "axios";

export const unfollowEvent = async (
  destroy: any,
  userId: string,
  eventId: string
): Promise<AxiosResponse<any>> => {
  return await destroy(`/api/unfollow-event`, {
    data: {
      user: userId,
      event: eventId,
    },
  });
};
