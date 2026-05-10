import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/auth";
export default function EditProfileScreen() {
  const { user, saveUser } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [senha, setSenha] = useState("");
  const [profileImage, setProfileImage] = useState(user?.foto ?? "https://via.placeholder.com/150");
  const [erro, setErro] = useState("");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      setErro("Permissão de acesso às fotos negada.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setErro("");
    }
  };

  function handleSalvar() {
    if (!nome || !email) {
      setErro("Nome e email são obrigatórios.");
      return;
    }

    saveUser({
      id: user?.id ?? "",
      nome,
      email,
      foto: profileImage,
    });

    setErro("");
    router.back(); 
  }

  function handleSair() {
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Editar Perfil</Text>

        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <View style={styles.editIconContainer}>
              <Feather name="edit-2" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* Mensagem de erro */}
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <View style={styles.form}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={(text) => { setNome(text); setErro(""); }}
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => { setEmail(text); setErro(""); }}
              keyboardType="email-address"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={(text) => { setSenha(text); setErro(""); }}
              secureTextEntry
              placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSair}>
          <MaterialIcons name="power-settings-new" size={24} color="#FF4444" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: "center",
    paddingTop: 50,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileCard: {
    width: "90%",
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#444",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#5CD338",
    padding: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#000",
  },
  erro: {
    color: "#FF4444",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#1C1C1C",
    color: "#FFF",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#5CD338",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    width: "90%",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  logoutText: {
    color: "#FF4444",
    marginLeft: 10,
    fontSize: 16,
  },
});