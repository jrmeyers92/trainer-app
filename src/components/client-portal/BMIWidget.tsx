import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Client {
  height_feet: number | null;
  height_inches: number | null;
  current_weight_lbs: number | null;
}

interface BMIWidgetProps {
  client: Client;
}

function calculateBMI(
  heightFeet: number | null,
  heightInches: number | null,
  weightLbs: number | null
): number | null {
  if (!heightFeet || !weightLbs) return null;

  const totalInches = heightFeet * 12 + (heightInches || 0);
  const heightMeters = totalInches * 0.0254;
  const weightKg = weightLbs * 0.453592;

  const bmi = weightKg / (heightMeters * heightMeters);
  return Math.round(bmi * 10) / 10;
}

function getBMICategory(bmi: number): {
  category: string;
  color: string;
  description: string;
} {
  if (bmi < 18.5) {
    return {
      category: "Underweight",
      color: "text-blue-600",
      description: "Below normal weight range",
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      category: "Normal",
      color: "text-green-600",
      description: "Within healthy weight range",
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      category: "Overweight",
      color: "text-yellow-600",
      description: "Above normal weight range",
    };
  } else {
    return {
      category: "Obese",
      color: "text-red-600",
      description: "Significantly above normal range",
    };
  }
}

export default function BMIWidget({ client }: BMIWidgetProps) {
  const bmi = calculateBMI(
    client.height_feet,
    client.height_inches,
    client.current_weight_lbs
  );

  if (bmi === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>BMI</CardTitle>
          <CardDescription>Body Mass Index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[120px] items-center justify-center text-muted-foreground text-sm">
            Missing height or weight data
          </div>
        </CardContent>
      </Card>
    );
  }

  const { category, color, description } = getBMICategory(bmi);

  return (
    <Card>
      <CardHeader>
        <CardTitle>BMI</CardTitle>
        <CardDescription>Body Mass Index</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold">{bmi}</div>
            <div className={`text-lg font-semibold mt-2 ${color}`}>
              {category}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>

          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="bg-blue-500 w-[18.5%]"></div>
              <div className="bg-green-500 w-[25%]"></div>
              <div className="bg-yellow-500 w-[20%]"></div>
              <div className="bg-red-500 flex-1"></div>
            </div>
            <div
              className="absolute top-0 h-full w-1 bg-black"
              style={{
                left: `${Math.min((bmi / 40) * 100, 100)}%`,
                transform: "translateX(-50%)",
              }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
