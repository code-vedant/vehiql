"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/prisma";
import aj from "../lib/arjet";
import { request } from "@arcjet/next";
import { Car } from "@prisma/client";

interface SerializedCar {
  [key: string]: any;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

// Function to serialize car data
function serializeCarData(car: Car): SerializedCar {
  return {
    ...car,
    price: car.price ? parseFloat(car.price.toString()) : 0,
    createdAt: car.createdAt?.toISOString(),
    updatedAt: car.updatedAt?.toISOString(),
  };
}

interface FeaturedCarsResult extends Array<SerializedCar> {}

/**
 * Get featured cars for the homepage
 */
export async function getFeaturedCars(limit: number = 3): Promise<FeaturedCarsResult> {
  try {
    const cars = await db.car.findMany({
      where: {
        featured: true,
        status: "AVAILABLE",
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return cars.map(serializeCarData);
  } catch (error: any) {
    throw new Error("Error fetching featured cars:" + error.message);
  }
}

// Function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

interface ImageSearchResultSuccess {
  success: true;
  data: {
    brand: string;
    bodyType: string;
    color: string;
    confidence: number;
  };
}

interface ImageSearchResultFailure {
  success: false;
  error: string;
}

type ImageSearchResult = ImageSearchResultSuccess | ImageSearchResultFailure;

/**
 * Process car image with Gemini AI
 */
export async function processImageSearch(file: File): Promise<ImageSearchResult> {
  try {
    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        return {
          success: false,
          error: "Too many requests. Please try again later.",
        };
      }

      return {
        success: false,
        error: "Request blocked",
      };
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: "Gemini API key is not configured",
      };
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert image file to base64
    const base64Image = await fileToBase64(file);

    // Create image part for the model
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    // Define the prompt for car search extraction
    const prompt = `
      A Analyze this car image and extract the following information:
      1. Brand (manufacturer)
      2. Model
      3. Year (approximately)
      4. Color
      5. Body type (SUV, Sedan, Hatchback, etc.)
      6. Mileage
      7. Fuel type (your best guess)
      8. Transmission type (your best guess)
      9. Price (your best guess in INR)
      9. Short Description as to be added to a car listing

      Format your response as a clean JSON object with these fields:
      {
        "brand": "",
        "model": "",
        "year": 0000,
        "color": "",
        "price": "",
        "mileage": "",
        "bodyType": "",
        "fuelType": "",
        "transmission": "",
        "description": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
    `;

    // Get response from Gemini
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    // Parse the JSON response
    try {
      const carDetails = JSON.parse(cleanedText);

      // Return success response with data
      return {
        success: true,
        data: carDetails,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error: any) {
    console.error("AI Search error:", error);
    return {
      success: false,
      error: "AI Search error:" + error.message,
    };
  }
}