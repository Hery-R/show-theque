import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        'muted-foreground': "var(--muted-foreground)",
        popover: "var(--popover)",
        'popover-foreground': "var(--popover-foreground)",
        card: "var(--card)",
        'card-foreground': "var(--card-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        primary: "var(--primary)",
        'primary-foreground': "var(--primary-foreground)",
        secondary: "var(--secondary)",
        'secondary-foreground': "var(--secondary-foreground)",
        accent: "var(--accent)",
        'accent-foreground': "var(--accent-foreground)",
        destructive: "var(--destructive)",
        'destructive-foreground': "var(--destructive-foreground)",
        ring: "var(--ring)",
        'chart-1': "var(--chart-1)",
        'chart-2': "var(--chart-2)",
        'chart-3': "var(--chart-3)",
        'chart-4': "var(--chart-4)",
        'chart-5': "var(--chart-5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
