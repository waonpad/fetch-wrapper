import { QUERY_KEYS } from "@/constants/react-query-keys";
import { createContract } from "@/lib/fetcher/contract";
import { contractFetcher } from "@/lib/fetcher/contract/contract-fetcher";
import { queryClient } from "@/lib/react-query";
import type { ExtractFnReturnType } from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { postSchema } from "../schemas";

export const deletePostContract = createContract({
  path: "https://jsonplaceholder.typicode.com/posts/{id}",
  method: "DELETE",
  params: z.object({
    id: postSchema.shape.id,
  }),
  response: z.object({}),
});

export const deletePost = contractFetcher(deletePostContract);

export const useDeletePostMutation = ({
  config,
}: {
  config?: UseMutationOptions<ExtractFnReturnType<typeof deletePost>, unknown, Parameters<typeof deletePost>[0]>;
}) => {
  return useMutation({
    ...config,
    // contractFetcherはエラーを投げずreturnするので、onSuccess内でエラーの有無を確認する
    onSuccess([_, error], variables) {
      if (!error) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.POSTS, variables.params.id],
        });
      }
    },
    mutationFn: deletePost,
  });
};
