import metalImg from "@/assets/materials/metal.png";
import metalHotImg from "@/assets/materials/metal_hot.png";
import woodImg from "@/assets/materials/wood.png";
import woodBurntImg from "@/assets/materials/wood_burnt.png";
import plasticImg from "@/assets/materials/plastic.png";
import waterImg from "@/assets/materials/water.png";
import iceImg from "@/assets/materials/ice.png";
import steamImg from "@/assets/materials/steam.png";
import soilImg from "@/assets/materials/soil.png";
import waxImg from "@/assets/materials/wax.png";
import chocolateImg from "@/assets/materials/chocolate.png";
import butterImg from "@/assets/materials/butter.png";
import glassImg from "@/assets/materials/glass.png";
import meltedBrownImg from "@/assets/materials/melted_brown.png";
import meltedYellowImg from "@/assets/materials/melted_yellow.png";

export interface StateFrame {
  /** Temperature threshold (°C). The state with the highest minTemp <= current shows. */
  minTemp: number;
  image: string;
  stateName: string;
  description: string;
}

export interface Material {
  id: string;
  name: string;
  thumbnail: string;
  thermalConductivity: number; // W/(m·K)
  specificHeatCapacity: number; // J/(kg·K)
  /** Higher = changes faster per second of heat/cool. */
  responseRate: number;
  startTemp: number;
  minTemp: number;
  maxTemp: number;
  explanation: string;
  states: StateFrame[]; // sorted ascending by minTemp
}

export const MATERIALS: Material[] = [
  {
    id: "metal",
    name: "Metal",
    thumbnail: metalImg,
    thermalConductivity: 205,
    specificHeatCapacity: 385,
    responseRate: 8,
    startTemp: 25,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Metals have very high thermal conductivity, so heat moves through them quickly. Their low specific heat means even a small amount of energy raises their temperature a lot.",
    states: [
      { minTemp: -25, image: metalImg, stateName: "Cold Solid", description: "The metal feels icy cold to the touch." },
      { minTemp: 25, image: metalImg, stateName: "Solid", description: "A normal solid metal block at room temperature." },
      { minTemp: 90, image: metalHotImg, stateName: "Red Hot", description: "The metal glows hot — it heats up extremely fast!" },
    ],
  },
  {
    id: "wood",
    name: "Wood",
    thumbnail: woodImg,
    thermalConductivity: 0.12,
    specificHeatCapacity: 1700,
    responseRate: 2.5,
    startTemp: 25,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Wood is a great insulator — its low thermal conductivity means heat moves through it slowly. At very high temperatures it doesn't melt; it burns.",
    states: [
      { minTemp: -25, image: woodImg, stateName: "Cold Solid", description: "Wood barely feels different in the cold." },
      { minTemp: 25, image: woodImg, stateName: "Solid", description: "Plain wood log at room temperature." },
      { minTemp: 100, image: woodBurntImg, stateName: "Burning / Charred", description: "Wood doesn't melt — it burns and turns to charcoal!" },
    ],
  },
  {
    id: "plastic",
    name: "Plastic",
    thumbnail: plasticImg,
    thermalConductivity: 0.2,
    specificHeatCapacity: 1500,
    responseRate: 3.5,
    startTemp: 25,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Plastics are insulators with low conductivity. They soften and lose their shape when heated past about 100°C.",
    states: [
      { minTemp: -25, image: plasticImg, stateName: "Cold Solid", description: "Plastic gets stiffer in the cold." },
      { minTemp: 25, image: plasticImg, stateName: "Solid", description: "A normal plastic cube." },
      { minTemp: 100, image: meltedBrownImg, stateName: "Melted", description: "The plastic softens and loses its shape." },
    ],
  },
  {
    id: "water",
    name: "Water",
    thumbnail: waterImg,
    thermalConductivity: 0.6,
    specificHeatCapacity: 4186,
    responseRate: 2,
    startTemp: 20,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Water has a very high specific heat capacity (4186 J/kg·K) so it warms up and cools down slowly. It freezes at 0°C and boils at 100°C.",
    states: [
      { minTemp: -25, image: iceImg, stateName: "Solid (Ice)", description: "Below 0°C the water freezes into ice." },
      { minTemp: 0.1, image: waterImg, stateName: "Liquid", description: "Liquid water at room temperature." },
      { minTemp: 100, image: steamImg, stateName: "Gas (Steam)", description: "At 100°C the water boils and turns into steam." },
    ],
  },
  {
    id: "soil",
    name: "Soil",
    thumbnail: soilImg,
    thermalConductivity: 0.5,
    specificHeatCapacity: 800,
    responseRate: 3,
    startTemp: 22,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Dry soil heats and cools faster than water because of its lower specific heat. That's why land warms quicker than the ocean in the sun.",
    states: [
      { minTemp: -25, image: soilImg, stateName: "Frozen", description: "The soil is frozen solid." },
      { minTemp: 22, image: soilImg, stateName: "Normal", description: "Soil at room temperature." },
      { minTemp: 80, image: soilImg, stateName: "Hot & Dry", description: "The soil becomes very hot and dries out." },
    ],
  },
  {
    id: "wax",
    name: "Wax",
    thumbnail: waxImg,
    thermalConductivity: 0.25,
    specificHeatCapacity: 2500,
    responseRate: 3.5,
    startTemp: 22,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Wax melts around 60°C. It's a poor conductor but absorbs energy as it changes from solid to liquid.",
    states: [
      { minTemp: -25, image: waxImg, stateName: "Hard Solid", description: "Wax becomes extra hard in the cold." },
      { minTemp: 22, image: waxImg, stateName: "Solid", description: "A normal candle wax block." },
      { minTemp: 60, image: meltedYellowImg, stateName: "Melted Liquid", description: "Wax melts into a runny liquid above 60°C." },
    ],
  },
  {
    id: "chocolate",
    name: "Chocolate",
    thumbnail: chocolateImg,
    thermalConductivity: 0.2,
    specificHeatCapacity: 1500,
    responseRate: 4,
    startTemp: 22,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Chocolate melts at about 34°C — close to body temperature! That's why it melts in your hand.",
    states: [
      { minTemp: -25, image: chocolateImg, stateName: "Cold & Hard", description: "Cold chocolate gets very hard and snaps cleanly." },
      { minTemp: 22, image: chocolateImg, stateName: "Solid", description: "A solid chocolate bar." },
      { minTemp: 34, image: meltedBrownImg, stateName: "Melted", description: "The chocolate melts into a smooth liquid." },
    ],
  },
  {
    id: "ice",
    name: "Ice",
    thumbnail: iceImg,
    thermalConductivity: 2.2,
    specificHeatCapacity: 2090,
    responseRate: 3,
    startTemp: -10,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Ice is frozen water. It melts at 0°C, absorbing a lot of energy (latent heat) without changing temperature during the change.",
    states: [
      { minTemp: -25, image: iceImg, stateName: "Solid Ice", description: "Frozen solid below 0°C." },
      { minTemp: 0.1, image: waterImg, stateName: "Water", description: "The ice melts into liquid water." },
      { minTemp: 100, image: steamImg, stateName: "Steam", description: "The water boils into steam." },
    ],
  },
  {
    id: "butter",
    name: "Butter",
    thumbnail: butterImg,
    thermalConductivity: 0.2,
    specificHeatCapacity: 2100,
    responseRate: 3.5,
    startTemp: 22,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Butter is mostly fat and melts gradually around 32-35°C. It softens before it fully melts.",
    states: [
      { minTemp: -25, image: butterImg, stateName: "Frozen", description: "Hard and brittle." },
      { minTemp: 22, image: butterImg, stateName: "Solid", description: "A normal stick of butter." },
      { minTemp: 32, image: meltedYellowImg, stateName: "Melted", description: "Butter melts into a yellow oily liquid." },
    ],
  },
  {
    id: "glass",
    name: "Glass",
    thumbnail: glassImg,
    thermalConductivity: 1.0,
    specificHeatCapacity: 840,
    responseRate: 3,
    startTemp: 22,
    minTemp: -25,
    maxTemp: 120,
    explanation:
      "Glass conducts heat moderately and doesn't melt until extremely high temperatures (above 1400°C). In our beaker it just heats up or cools down.",
    states: [
      { minTemp: -25, image: glassImg, stateName: "Cold Solid", description: "Cold glass — be careful, it can crack!" },
      { minTemp: 22, image: glassImg, stateName: "Solid", description: "A clear glass cube." },
      { minTemp: 90, image: glassImg, stateName: "Hot Solid", description: "Very hot to touch but stays solid." },
    ],
  },
];

export function getMaterial(id: string): Material | undefined {
  return MATERIALS.find((m) => m.id === id);
}

export function currentState(material: Material, temp: number): StateFrame {
  let active = material.states[0];
  for (const s of material.states) {
    if (temp >= s.minTemp) active = s;
  }
  return active;
}
