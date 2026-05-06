import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { themas } from "../theme/themes";

// aqui é a tipagem
type OpcaoPagamento = {
  icone: keyof typeof MaterialIcons.glyphMap; // isso eu já vi tu usando
  label: string; // o valor que vai passar na despesa
};

export default function ExpenseScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [number, setNumber] = useState("");
  const [value, setValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // os estados que é boleano se mostra a o modal ou não
  const [selectedMethod, setSelectedMethod] = useState<OpcaoPagamento | null>(null); // aqui passando o tipo e guardando o que tu escolheu

  const opcoes: OpcaoPagamento[] = [
    { label: "PIX", icone: "grid-view" },
    { label: "Débito", icone: "credit-card" },
    { label: "Crédito", icone: "credit-card" },
    { label: "Dinheiro", icone: "paid" },
  ];

  const categorias = [
    { label: "Alimentação", value: 1 },
    { label: "Transporte", value: 2 },
    { label: "Assinatura", value: 3 },
    { label: "Pessoal", value: 4 },
    { label: "Saúde", value: 5 },
    { label: "Moradia", value: 6 },
  ];
  // TIRA OS COMENTARIOS DPS kkkk
  function SelectOption(opcao: OpcaoPagamento) {
    setSelectedMethod(opcao); // aqui ele captura a opção que tu escolheu
    setModalVisible(false); // quando escolher ele fecha o modal
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.text1}>Nova </Text>
            <Text style={styles.text2}>Despesa</Text>
          </View>
        </View>

        <Text style={styles.text3}>Nome da Despesa</Text>
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="Adicionar Nome"
          placeholderTextColor="#888"
        />

        <Text style={styles.text3}>Valor da Despesa</Text>
        <View style={styles.containerInput}>
          <Text style={styles.prefix}>R$</Text>
          <TextInput
            style={styles.inputClean}
            onChangeText={setNumber}
            value={number}
            placeholder="0,00"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.text3}>Categoria</Text>
        <Dropdown
          data={categorias}
          labelField="label"
          valueField="value"
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          maxHeight={150}
          value={value}
          placeholder="Selecione a Categoria"
          containerStyle={styles.containerStyle}
          onChange={(item) => setValue(item.value)}
        />

        <Text style={styles.text3}>Método</Text>
        <TouchableOpacity 
          style={styles.methodSelector} 
          onPress={() => setModalVisible(true)}
        >
          {selectedMethod ? ( // isso aqui é uma substituição em vez de escrever um por um ele faz um map pra colocar cada elemento
            <View style={styles.selectedMethodRow}>
              <MaterialIcons name={selectedMethod.icone} size={24} color={themas.colors.primary} />
              <Text style={styles.selectedMethodText}>{selectedMethod.label}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderStyle}>Selecione um método</Text>
          )}
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true} // isso é uma propriedade do modal pra gente ver o fundo da tela
          animationType="fade" // isso é pra animação ficar suave
          onRequestClose={() => setModalVisible(false)} // isso é uma propiedade pra android pode acontecer de alguem clicar em voltar e voltar a tela em vez do modal
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um método:</Text>

              {opcoes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionCard}
                  onPress={() => SelectOption(item)}
                >
                  <MaterialIcons name={item.icone} size={24} color="#4CAF50" />
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelLink}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: themas.colors.bgScreen,
  },
  container: {
    margin: 20,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  textContainer: {
    flexDirection: "row",
  },
  text1: {
    color: themas.colors.secundary,
    fontSize: 18,
    fontWeight: "400",
  },
  text2: {
    color: themas.colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  text3: {
    color: themas.colors.secundary,
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 25,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 13,
    paddingHorizontal: 15,
    backgroundColor: themas.colors.bgInputs,
    color: themas.colors.primary,
  },
  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 13,
    paddingHorizontal: 15,
    height: 50,
  },
  prefix: {
    fontSize: 16,
    color: "white",
    marginRight: 5,
  },
  inputClean: {
    flex: 1,
    color: themas.colors.primary,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 13,
    paddingHorizontal: 15,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: themas.colors.primary,
  },
  containerStyle: {
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 10,
    borderWidth: 0,
  },
  methodSelector: {
    backgroundColor: themas.colors.bgInputs,
    height: 55,
    borderRadius: 13,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  selectedMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedMethodText: {
    color: themas.colors.primary,
    fontSize: 16,
    marginLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#000",
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionCard: {
    width: "100%",
    backgroundColor: "#1C1C1C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 12,
  },
  optionLabel: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  cancelLink: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
  },
});