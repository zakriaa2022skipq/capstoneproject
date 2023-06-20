import { useMutation } from 'react-query';
import axios from '../../utils/axios';

interface Params {
  onSuccessFn?: (arg?: object) => void;
  onSuccessArg?: object;
}

export const useUpvoteMutation = ({ onSuccessFn, onSuccessArg }: Params) =>
  useMutation({
    mutationFn: (storyId: string) =>
      axios({ url: `api/v1/story/${storyId}/upvote`, withCredentials: true, method: 'PATCH' }),
    onSuccess: () => {
      if (onSuccessFn && onSuccessArg) {
        onSuccessFn(onSuccessArg);
      } else if (onSuccessFn) onSuccessFn();
    },
  });
export const useDownvoteMutation = ({ onSuccessFn, onSuccessArg }: Params) =>
  useMutation({
    mutationFn: (storyId: string) =>
      axios({ url: `api/v1/story/${storyId}/downvote`, withCredentials: true, method: 'PATCH' }),
    onSuccess: () => {
      if (onSuccessFn) {
        onSuccessFn(onSuccessArg);
      }
    },
  });
