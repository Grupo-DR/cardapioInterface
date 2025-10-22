import { Button } from "@/components/ui/button";
import {
  addEmploye,
  disableEmploye,
  getEmployes,
  updateEmploye,
} from "@/lib/api/supabaseApi";
import { DotsThreeVerticalIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AddEmploye = () => {
  const [employes, setEmployes] = useState<any[] | null>([]);
  const [selectedEmploye, setSelectedEmploye] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [numeroCru, setNumeroCru] = useState("");
  const [newEmploye, setNewEmploye] = useState({
    nome: "",
    cc: "",
    numero: "",
  });

  function handleEdit(employe: any) {
    setSelectedEmploye(employe);
    setOpenEdit(true);
  }

  function formatarTelefone(input: string): {
    formatado: string;
    cru: string;
  } {
    let valor = input.replace(/\D/g, "");
    if (valor.length > 13) valor = valor.substring(0, 13);
    let formatado = "";
    if (valor.length > 0) formatado = "+" + valor.substring(0, 2);
    if (valor.length >= 3) formatado += " (" + valor.substring(2, 4);
    if (valor.length >= 4) formatado += ") ";
    if (valor.length >= 5 && valor.length <= 9) formatado += valor.substring(4);
    if (valor.length >= 10)
      formatado += valor.substring(4, 9) + "-" + valor.substring(9);

    return { formatado, cru: valor };
  }

  const handleNumeroChange = (e: any) => {
    const { formatado, cru } = formatarTelefone(e.target.value);

    setNewEmploye({ ...newEmploye, numero: formatado });
    setNumeroCru(cru);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getEmployes();
      setEmployes(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Button onClick={() => setOpenAdd(true)}>
        {" "}
        <PlusIcon /> Adicionar Funcionário
      </Button>
      {employes &&
        employes.map(({ id, nome, cc, numero }) => {
          const { formatado } = formatarTelefone(numero);
          return (
            <div
              key={id}
              className="my-2 p-2 bg-slate-200 rounded items-center flex justify-between"
            >
              <div>
                <p>Nome: {nome}</p>
                <p>CC: {cc}</p>
                <span>Número: {formatado}</span>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="size-8"
                onClick={() => handleEdit({ id, nome, cc, numero })}
              >
                <DotsThreeVerticalIcon weight="bold" />
              </Button>
            </div>
          );
        })}

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize as informações do funcionário selecionado.
            </DialogDescription>
          </DialogHeader>

          {selectedEmploye && (
            <form className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={selectedEmploye.nome}
                  onChange={(e) =>
                    setSelectedEmploye({
                      ...selectedEmploye,
                      nome: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  value={selectedEmploye.cc}
                  onChange={(e) =>
                    setSelectedEmploye({
                      ...selectedEmploye,
                      cc: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formatarTelefone(selectedEmploye.numero).formatado}
                  onChange={(e) =>
                    setSelectedEmploye({
                      ...selectedEmploye,
                      numero: formatarTelefone(e.target.value).cru,
                    })
                  }
                />
              </div>
              <Button
                type="button"
                className="w-full"
                variant="destructive"
                onClick={async () => {
                  const desativado = await disableEmploye(selectedEmploye.id);
                  if (desativado && desativado.length > 0) {
                    setEmployes(
                      (prev) =>
                        prev?.filter((emp) => emp.id !== desativado[0].id) ??
                        [],
                    );
                  }
                  setOpenEdit(false);
                }}
              >
                Excluir
              </Button>

              <Button
                type="button"
                className="w-full"
                onClick={async () => {
                  if (!selectedEmploye) return;

                  const atualizado = await updateEmploye(selectedEmploye.id, {
                    nome: selectedEmploye.nome,
                    cc: selectedEmploye.cc,
                    numero: selectedEmploye.numero,
                  });

                  if (atualizado && atualizado.length > 0) {
                    setEmployes(
                      (prev) =>
                        prev?.map((emp) =>
                          emp.id === atualizado[0].id ? atualizado[0] : emp,
                        ) ?? [],
                    );
                  }

                  setOpenEdit(false);
                }}
              >
                Salvar
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo funcionário.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4">
            <div>
              <Label htmlFor="nomeAdd">Nome</Label>
              <Input
                id="nomeAdd"
                value={newEmploye.nome}
                onChange={(e) =>
                  setNewEmploye({ ...newEmploye, nome: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="ccAdd">CC</Label>
              <Input
                id="ccAdd"
                value={newEmploye.cc}
                onChange={(e) =>
                  setNewEmploye({ ...newEmploye, cc: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="numeroAdd">Número</Label>
              <Input
                id="numeroAdd"
                value={newEmploye.numero}
                onChange={handleNumeroChange}
                maxLength={19}
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={async () => {
                const payload = {
                  ...newEmploye,
                  numero: numeroCru,
                };
                const novo: any = await addEmploye(payload);
                if (novo && novo.length > 0) {
                  setEmployes((prev) => [...(prev ?? []), novo[0]]);
                }
                setNewEmploye({ nome: "", cc: "", numero: "" });
                setOpenAdd(false);
              }}
            >
              Adicionar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
