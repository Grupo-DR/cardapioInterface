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
  const [newEmploye, setNewEmploye] = useState({
    nome: "",
    cc: "",
    numero: "",
  });

  async function fetchData() {
    const data = await getEmployes();
    setEmployes(data);
  }

  function handleEdit(employe: any) {
    setSelectedEmploye(employe);
    setOpenEdit(true);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Button onClick={() => setOpenAdd(true)}>
        {" "}
        <PlusIcon /> Adicionar Funcionário
      </Button>
      {employes &&
        employes.map(({ id, nome, cc, numero }) => (
          <div
            key={id}
            className="my-2 p-2 bg-slate-200 rounded items-center flex justify-between"
          >
            <div>
              <p>Nome: {nome}</p>
              <p>CC: {cc}</p>
              <span>Número: {numero}</span>
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
        ))}

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
                  value={selectedEmploye.numero}
                  onChange={(e) =>
                    setSelectedEmploye({
                      ...selectedEmploye,
                      numero: e.target.value,
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
                onChange={(e) =>
                  setNewEmploye({ ...newEmploye, numero: e.target.value })
                }
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={async () => {
                const novo: any = await addEmploye(newEmploye);
                if (novo && novo.length > 0) {
                  setEmployes((prev) => [...(prev ?? []), novo[0]]); // adiciona o novo item à lista
                }
                setNewEmploye({ nome: "", cc: "", numero: "" }); // limpa os campos
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
