import { useState, memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Participant = {
  id: string;
  name: string;
  // lo que pagó en caja ese usuario
  paid: number;
  // parte que le corresponde según la división
  share: number;
};

export type Expense = {
  id: string;
  title: string;          // ej: "Pizza • Grupo Viaje"
  categoryIcon?: string;  // ej: "pizza-outline"
  amount: number;         // total del gasto
  payerId: string;        // quién pagó en caja
  createdAt: string;      // "hace 2 h", "ayer", etc.
  participants: Participant[]; // todos los implicados (incluye pagador)
};

function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}

/** Para cada usuario: balance > 0 => debe pagar; balance < 0 => debe recibir */
function computeBalances(expense: Expense) {
  return expense.participants.map((p) => {
    const balance = p.share - p.paid;
    return { ...p, balance };
  });
}

function BalanceBadge({ value }: { value: number }) {
  const color = value > 0 ? "#ef4444" : value < 0 ? "#22c55e" : "#94a3b8";
  const bg =
    value > 0
      ? "rgba(239,68,68,0.12)"
      : value < 0
      ? "rgba(34,197,94,0.12)"
      : "rgba(148,163,184,0.12)";
  const label =
    value > 0
      ? `Debe ${formatEUR(Math.abs(value))}`
      : value < 0
      ? `Recibe ${formatEUR(Math.abs(value))}`
      : "Saldo 0";

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: "#1f2a44",
      }}
    >
      <Text style={{ color, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export default memo(function ExpenseItem({ expense }: { expense: Expense }) {
  const [open, setOpen] = useState(false);
  const balances = computeBalances(expense);
  const payer = expense.participants.find((p) => p.id === expense.payerId);

  return (
    <View
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#101827",
      }}
    >
      {/* Cabecera compacta */}
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            borderWidth: 1,
            borderColor: "#1f2a44",
          }}
        >
          <Ionicons
            name={(expense.categoryIcon as any) ?? "cash-outline"}
            size={18}
            color="#60a5fa"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: "#e5e7eb", fontWeight: "600" }}>
            {expense.title}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>
            {expense.createdAt}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end", gap: 6 }}>
          <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>
            {formatEUR(expense.amount)}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 11 }}>
            Pagó {payer?.name ?? "—"}
          </Text>
        </View>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="#475569"
        />
      </Pressable>

      {/* Desplegable de desglose */}
      {open && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: "#0f172a",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#1f2a44",
            overflow: "hidden",
          }}
        >
          {/* Cabecera del desglose */}
          <View
            style={{
              padding: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#94a3b8", fontSize: 12 }}>
              Reparto entre {expense.participants.length} personas
            </Text>
            <Text style={{ color: "#cbd5e1", fontSize: 12, fontWeight: "700" }}>
              Total {formatEUR(expense.amount)}
            </Text>
          </View>

          {/* Filas por participante */}
          {balances.map((p) => (
            <View
              key={p.id}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: "#101827",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Indicador */}
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    p.id === expense.payerId ? "#22c55e" : "#64748b",
                }}
              />
              {/* Nombre + detalles */}
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#e5e7eb", fontWeight: "600" }}>
                  {p.name}
                </Text>
                <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                  Parte {formatEUR(p.share)} • Pagó {formatEUR(p.paid)}
                </Text>
              </View>
              {/* Balance individual */}
              <BalanceBadge value={p.balance} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
});
