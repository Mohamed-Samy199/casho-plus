import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as noteApi from "../../api/note.api";

const NOTES_KEY = ["notes"];

export function useNotes(params) {
  return useQuery({ queryKey: [...NOTES_KEY, params], queryFn: () => noteApi.listNotes(params) });
}

function useNoteMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }) });
}

export const useCreateNote = () => useNoteMutation(noteApi.createNote);
export const useUpdateNote = () => useNoteMutation(noteApi.updateNote);
export const useToggleNotePin = () => useNoteMutation(noteApi.togglePin);
export const useArchiveNote = () => useNoteMutation(noteApi.archiveNote);
