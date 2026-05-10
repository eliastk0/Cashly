import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useAuth } from "../../contexts/auth";

const { width } = Dimensions.get("window");

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const dadosMensais = [
  { despesa: 1200, receita: 1800 },
  { despesa: 900,  receita: 1500 },
  { despesa: 1500, receita: 1200 },
  { despesa: 800,  receita: 2000 },
  { despesa: 1100, receita: 1700 },
  { despesa: 1300, receita: 1400 },
  { despesa: 700,  receita: 1900 },
  { despesa: 1600, receita: 1100 },
  { despesa: 950,  receita: 1650 },
  { despesa: 1250, receita: 1350 },
  { despesa: 1050, receita: 1550 },
  { despesa: 880,  receita: 2100 },
];

const totalDespesa = dadosMensais.reduce((s, d) => s + d.despesa, 0);
const totalReceita = dadosMensais.reduce((s, d) => s + d.receita, 0);
const total = totalDespesa + totalReceita;
const percDespesa = totalDespesa / total;
const percReceita = totalReceita / total;

const maxValor = Math.max(...dadosMensais.flatMap((d) => [d.despesa, d.receita]));

function DonutChart() {
  const size = 200;
  const stroke = 36;
  const radius = (size - stroke) / 2;
  const circunferencia = 2 * Math.PI * radius;
  const center = size / 2;

  const dashReceita = circunferencia * percReceita;

  return (
    <View style={donutStyles.wrapper}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E53935"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#5CD338"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dashReceita} ${circunferencia}`}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>

      <View style={donutStyles.centerLabel}>
        <Text style={donutStyles.percReceita}>{Math.round(percReceita * 100)}%</Text>
        <View style={donutStyles.divider} />
        <Text style={donutStyles.percDespesa}>{Math.round(percDespesa * 100)}%</Text>
      </View>
    </View>
  );
}

const donutStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
    height: 220,
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percReceita: {
    color: "#5CD338",
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    width: 30,
    height: 1,
    backgroundColor: "#444",
    marginVertical: 3,
  },
  percDespesa: {
    color: "#E53935",
    fontSize: 18,
    fontWeight: "bold",
  },
});

function BarChart() {
  const barWidth = (width * 0.9 - 40) / MESES.length / 2 - 2;

  return (
    <View style={barStyles.container}>
      <View style={barStyles.barsRow}>
        {dadosMensais.map((dado, i) => {
          const hDespesa = (dado.despesa / maxValor) * 90;
          const hReceita = (dado.receita / maxValor) * 90;
          return (
            <View key={i} style={barStyles.group}>
              <View style={[barStyles.bar, { height: hDespesa, backgroundColor: "#E53935", width: barWidth }]} />
              <View style={[barStyles.bar, { height: hReceita, backgroundColor: "#5CD338", width: barWidth }]} />
            </View>
          );
        })}
      </View>
      <View style={barStyles.labelsRow}>
        {MESES.map((m) => (
          <Text key={m} style={barStyles.mesLabel}>{m}</Text>
        ))}
      </View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 8,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    justifyContent: "space-between",
  },
  group: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 1,
  },
  bar: {
    borderRadius: 3,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  mesLabel: {
    color: "#888",
    fontSize: 9,
    textAlign: "center",
    flex: 1,
  },
});

export default function RelatoryScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.nome ?? "Usuário"}!</Text>
          <TouchableOpacity style={styles.bell}>
            <MaterialIcons name="notifications-none" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <View style={styles.toggleActive}>
            <Text style={styles.toggleTextActive}>Relatório</Text>
          </View>
          <TouchableOpacity
            style={styles.toggleInactive}
            onPress={() => router.push("/(tabs)/transactions-button")}
          >
            <Text style={styles.toggleTextInactive}>Histórico</Text>
          </TouchableOpacity>
        </View>

        <DonutChart />

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#E53935" }]} />
            <Text style={styles.legendText}>Despesa</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#5CD338" }]} />
            <Text style={styles.legendText}>Receita</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <BarChart />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  scroll: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  greeting: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  bell: {
    backgroundColor: "#1C1C1C",
    padding: 10,
    borderRadius: 50,
  },
  legend: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    color: "#FFF",
    fontSize: 14,
  },
  chartCard: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 16,
    paddingBottom: 12,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1C1C1C",
    borderRadius: 14,
    padding: 4,
    width: "100%",
    marginBottom: 4,
  },
  toggleActive: {
    flex: 1,
    backgroundColor: "#5CD338",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleInactive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleTextActive: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
  },
  toggleTextInactive: {
    color: "#888",
    fontSize: 15,
  },
});