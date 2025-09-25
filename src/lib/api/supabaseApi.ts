import { format } from "date-fns";
import supabase from "../supabase";

const hoje = format(new Date(), "yyyy-MM-dd");

export async function getEmployes() {
  const { data: funcionarios, error } = await supabase
    .from("funcionarios")
    .select("id, nome, cc, numero")
    .eq("status", true);
  if (error) {
    console.error("Erro ao buscar funcionários:", error);
    return null;
  }
  return funcionarios;
}

export async function updateEmploye(id: number, payload: any) {
  const { data, error } = await supabase
    .from("funcionarios")
    .update(payload)
    .eq("id", id)
    .select(); // retorna o registro atualizado

  if (error) {
    console.error("Erro ao atualizar funcionário:", error);
  } else {
    console.log("Funcionário atualizado:", data);
    return data;
  }
}

export async function disableEmploye(id: number) {
  const { data, error } = await supabase
    .from("funcionarios")
    .update({ status: false })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Erro ao desativar funcionário:", error);
    return null;
  } else {
    console.log("Funcionário desativado:", data);
    return data;
  }
}

export async function addEmploye(payload: any) {
  const { data, error } = await supabase
    .from("funcionarios")
    .insert([{ ...payload, status: true }])
    .select();

  if (error) {
    console.error("Erro ao inserir funcionário:", error);
  } else {
    console.log("Funcionários inseridos:", data);
    return data;
  }
}

export async function setMenu(payload: any) {
  const { data, error } = await supabase.from("cardapio").insert(payload);

  if (error) {
    console.error("Erro ao inserir funcionário:", error);
  } else {
    console.log("Funcionários inseridos:", data);
  }
}

export async function updateMenu(id: number, payload: any) {
  const { data, error } = await supabase
    .from("cardapio")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Erro ao atualizar cardápio:", error);
  }
  return data;
}

export async function getTodayMenu() {
  const { data: menuDia, error: errorDia } = await supabase
    .from("cardapio")
    .select()
    .eq("data", hoje)
    .single();

  if (errorDia) {
    console.error("Erro ao buscar cardápio:", errorDia);
    return null;
  }

  return menuDia;
}

export async function getAnswers() {
  const hoje = format(new Date(), "yyyy-MM-dd");
  const { data, error } = await supabase
    .from("respostas")
    .select(
      `
      escolha,
      funcionarios!inner (
        nome,
        cc,
        numero
      )
    `,
    )
    .eq("data_menu", hoje);

  if (error) {
    console.error("Erro ao buscar respostas:", error);
    return [];
  }
  return data;
}

export async function getRespostasDoDia(data: string) {
  const { data: respostas, error } = await supabase
    .from("respostas")
    .select(
      `
      escolha,
      funcionario:funcionario_id (
        nome,
        cc
      )
    `,
    )
    .eq("data", data);

  if (error) {
    console.error(error);
    throw new Error("Erro ao buscar respostas do dia");
  }

  return respostas;
}

export async function getCombinedMenu() {
  const hoje = format(new Date(), "yyyy-MM-dd");

  const { data: menuDia, error: errorDia } = await supabase
    .from("cardapio")
    .select()
    .eq("data", hoje)
    .single();

  if (errorDia) {
    console.error("Erro ao buscar cardápio:", errorDia);
    return null;
  }

  // Busca opções padrão
  const { data: menuPadrao, error: errorPadrao } = await supabase
    .from("opcoesPadrao")
    .select()
    .single();

  if (errorPadrao) {
    console.error("Erro ao buscar opções padrão:", errorPadrao);
    return null;
  }

  // Junta todas as opções do dia
  const opcoesDia = [
    menuDia?.primeira,
    menuDia?.segunda,
    menuDia?.terceira,
    menuDia?.quarta,
  ].filter(Boolean);

  // Junta todas as opções padrão
  const opcoesPadrao = [
    menuPadrao?.primeira,
    menuPadrao?.segunda,
    menuPadrao?.terceira,
    menuPadrao?.quarta,
  ].filter(Boolean);

  // Combina e remove duplicadas se quiser
  let options = [...opcoesDia, ...opcoesPadrao];

  return {
    options,
    guarnicao: menuDia?.guarnicao ?? "",
  };
}
