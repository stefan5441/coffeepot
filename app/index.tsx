import { OptionSetSelect } from "@/components/OptionSetSelect";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const [payment, setPayment] = useState<string | undefined>(undefined);
  const [payer, setPayer] = useState<string>("Stefan");
  const [debt, setDebt] = useState<number>(0); // Positive numbers = Stefan owes, Negative numbers = Sara owes
  const paymentPercentage = 0.5;

  const handleSubmit = (value: string) => {
    if (!payment) return;

    if (payer === "Sara") {
      setDebt((prevDebt) => prevDebt + Number(payment) * paymentPercentage);
    } else if (payer === "Stefan") {
      setDebt((prevDebt) => prevDebt - Number(payment) * paymentPercentage);
    }

    setPayment(undefined);
  };

  const displayedText = debt
    ? debt > 0
      ? `Steco i duzhe na Sara ${Math.abs(debt)} denari :(`
      : `Sara mu duzhe na Steco ${Math.abs(debt)} denari :/`
    : "Steco i Sara se razduzheni :D";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{displayedText}</Text>

      <TextInput
        value={payment}
        onChangeText={(text) => setPayment(text)}
        placeholder="Vnesi nov troshok"
        keyboardType="numeric"
        style={styles.input}
      />
      <OptionSetSelect selected={payer} setSelected={setPayer} />

      <Button title="Submit" onPress={() => handleSubmit(payment || "")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  text: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 30,
  },
  input: {
    width: "60%",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    fontSize: 24,
    textAlign: "center",
  },
  picker: {
    height: 300,
    width: "60%",
    fontSize: 24,
    color: "#000",
  },
  button: {
    width: "80%",
    fontSize: 24,
  },
});
