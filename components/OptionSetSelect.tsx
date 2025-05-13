import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

export function OptionSetSelect({ selected, setSelected }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {["Stefan", "Sara"].map((name) => (
        <TouchableOpacity
          key={name}
          onPress={() => setSelected(name)}
          style={{
            padding: 10,
            backgroundColor: selected === name ? "#007AFF" : "#EEE",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: selected === name ? "#FFF" : "#000", fontSize: 24 }}>{name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
