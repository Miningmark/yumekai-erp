import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function GET(req) {
  try {
    // Query to get all survey data
    const [rows] = await connection.query("SELECT * FROM survey2024");

    // Aggregate data by day
    const dataByDay = {};
    let totalRatingSum = 0;
    let totalRatingCount = 0;
    const bestParts = new Set();
    const improvements = new Set();

    let bestRow = null;
    let worstRow = null;
    let bestRowRatingSum = -Infinity;
    let worstRowRatingSum = Infinity;

    rows.forEach((row) => {
      const day = row.selectedDay;
      if (!dataByDay[day]) {
        dataByDay[day] = {
          yumeKaiRatingSum: 0,
          stageProgramRatingSum: 0,
          priceRatingSum: 0,
          workshopRatingSum: 0,
          vendorRatingSum: 0,
          artistRatingSum: 0,
          gameAreaRatingSum: 0,
          count: 0,
        };
      }

      // Helper function to add rating if valid
      const addRating = (ratingField, rating) => {
        if (rating <= 10) {
          dataByDay[day][ratingField] += rating;
          totalRatingSum += rating;
          totalRatingCount += 1;
        }
      };

      addRating("yumeKaiRatingSum", row.yumeKaiRating);
      addRating("stageProgramRatingSum", row.stageProgramRating);
      addRating("priceRatingSum", row.priceRating);
      addRating("workshopRatingSum", row.workshopRating);
      addRating("vendorRatingSum", row.vendorRating);
      addRating("artistRatingSum", row.artistRating);
      addRating("gameAreaRatingSum", row.gameAreaRating);

      dataByDay[day].count += 1;

      bestParts.add(row.bestPart);
      improvements.add(row.improvement);

      // Calculate the total rating for the current row
      const rowTotalRating = [
        row.yumeKaiRating,
        row.stageProgramRating,
        row.priceRating,
        row.workshopRating,
        row.vendorRating,
        row.artistRating,
        row.gameAreaRating,
      ]
        .filter((rating) => rating <= 10)
        .reduce((sum, rating) => sum + rating, 0);

      // Check for best row
      if (rowTotalRating > bestRowRatingSum) {
        bestRowRatingSum = rowTotalRating;
        bestRow = row;
      }

      // Check for worst row
      if (rowTotalRating < worstRowRatingSum) {
        worstRowRatingSum = rowTotalRating;
        worstRow = row;
      }
    });

    // Calculate average ratings for best and worst rows
    const calculateAverages = (row) => {
      const validRatings = [
        row.yumeKaiRating,
        row.stageProgramRating,
        row.priceRating,
        row.workshopRating,
        row.vendorRating,
        row.artistRating,
        row.gameAreaRating,
      ].filter((rating) => rating <= 10);

      const total = validRatings.reduce((sum, rating) => sum + rating, 0);
      return total / validRatings.length;
    };

    const bestRowAvgRating = bestRow ? calculateAverages(bestRow) : null;
    const worstRowAvgRating = worstRow ? calculateAverages(worstRow) : null;

    // Calculate average ratings by day
    const averagesByDay = Object.entries(dataByDay).map(([day, data]) => ({
      day,
      yumeKaiRatingAvg: data.yumeKaiRatingSum / data.count,
      stageProgramRatingAvg: data.stageProgramRatingSum / data.count,
      priceRatingAvg: data.priceRatingSum / data.count,
      workshopRatingAvg: data.workshopRatingSum / data.count,
      vendorRatingAvg: data.vendorRatingSum / data.count,
      artistRatingAvg: data.artistRatingSum / data.count,
      gameAreaRatingAvg: data.gameAreaRatingSum / data.count,
    }));

    // Calculate overall average rating
    const overallAvgRating = totalRatingSum / totalRatingCount;

    return NextResponse.json(
      {
        count: rows.length,
        averagesByDay,
        bestParts: Array.from(bestParts),
        improvements: Array.from(improvements),
        overallAvgRating,
        bestRow: {
          row: bestRow,
          averageRating: bestRowAvgRating,
        },
        worstRow: {
          row: worstRow,
          averageRating: worstRowAvgRating,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Fehler beim Abrufen der Daten:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
