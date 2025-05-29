import { supabase } from "./supabaseClient";

export const saveDiagram = async (diagram: unknown, name: string) => {
  const user = await supabase.auth.getUser();

  console.log("SAVE: user_id =", user.data.user?.id);
  console.log("SAVE: name =", name);
  console.log("SAVE: diagram =", diagram);
  console.log("SAVE: diagram typeof =", typeof diagram);
  return supabase
    .from("diagrams")
    .insert([{ user_id: user.data.user?.id, name, data: diagram }]);
};

export const loadDiagrams = async () => {
  const user = await supabase.auth.getUser();
  return supabase
    .from("diagrams")
    .select("*")
    .eq("user_id", user.data.user?.id);
};

export const deleteDiagram = async (id: number) => {
  return supabase.from("diagrams").delete().eq("id", id);
};
