import { hbClient } from "../config/hyperBrowserconfig.js";

const sessionStore = new Map();

const prepareSession = async (req, res) => {
  try {
    const { movieData } = req.body;
    if (!movieData) {
      return res.json({ message: "no movie data sorry" });
    }
    const session = await hbClient.sessions.create();
    const sessionId = session.id;
    const liveUrl = session.liveUrl;

    // Store movieData with sessionId
    sessionStore.set(sessionId, movieData);

    res.json({ sessionId, liveUrl, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create session." });
  }
};

const getBookingDetails = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { sessionId } = req.params;
  const movieData = sessionStore.get(sessionId);

  if (!movieData) {
    res.write(`event: error\n`);
    res.write(`data: {\"error\":\"Invalid sessionId\"}\n\n`);
    return res.end();
  }

  try {
    const result = await hbClient.agents.claudeComputerUse.startAndWait({
      task: `Book a movie ticket using this data: ${JSON.stringify(
        movieData
      )} on in.bookmyshow.com. And select chennai and wait for the user at the payments page for 4 minutes and stop the session.`,
      sessionId,
      useVision: true,
      keepBrowserOpen: true,
    });

    res.write(`event: done\n`);
    res.write(
      `data: ${JSON.stringify({ finalResult: result.data?.finalResult })}\n\n`
    );
    res.end();
    await hbClient.sessions.stop(sessionId);
  } catch (err) {
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
    await hbClient.sessions.stop(sessionId);
  }
};

export { prepareSession, getBookingDetails };

// export const bookingTicket = async (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   try {
//     // Create session and send live URL immediately
//     const { movieData } = req.body;
//     const session = await hbClient.sessions.create();
//     const sessionId = session.id;
//     const liveUrl = session.liveUrl;

//     res.write(`event: liveurl\n`);
//     res.write(`data: ${JSON.stringify({ liveUrl })}\n\n`);
//     res.write(`event: sessionID\n`);
//     res.write(`data: ${JSON.stringify({ sessionId })}\n\n`);

//     const result1 = await hbClient.agents.claudeComputerUse.startAndWait({
//       task: `Book a movie ticket from using the following movieData ${movieData} from in.bookmyshow.com/ And stop at the payments page for the user to interact.`,
//       sessionId,
//       keepBrowserOpen: true,
//     });

//     // Cleanup session
//     await hbClient.sessions.stop(sessionId);
//     if (result1.data) {
//       res.write(`event: done\n`);
//       res.write(`data:${result1.data?.finalResult} \n\n`);
//     }
//     res.end();
//   } catch (err) {
//     res.write(`event: error\n`);
//     res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
//     res.end();
//   }
// };

// import { Hyperbrowser } from "@hyperbrowser/sdk";
// import { config } from "dotenv";

// config();

// const hbClient = new Hyperbrowser({
//   apiKey: process.env.HYPERBROWSER_API_KEY,
// });

// const bookingTicket = async (req, res) => {
//   const session = await hbClient.sessions.create();
//   const liveUrl = session.liveUrl
//   try {
//     const result = await hbClient.agents.claudeComputerUse.startAndWait({
//       task: "What is the title of the first post on Hacker News today?",
//       sessionId: session.id,
//       keepBrowserOpen: true,
//     });

//     console.log(`Output:\n${result.data?.finalResult}`);

//     const result2 = await hbClient.agents.claudeComputerUse.startAndWait({
//       task: "Tell me how many upvotes the first post has.",
//       sessionId: session.id,
//     });

//     console.log(`\nOutput:\n${result2.data?.finalResult}`);
//   } catch (err) {
//     console.error(`Error: ${err}`);
//   } finally {
//     await hbClient.sessions.stop(session.id);
//   }
// };

// main().catch((err) => {
//   console.error(`Error: ${err.message}`);
// });

// const puppeteer = require('puppeteer');

// async function bookMovieTickets() {

//   // Launch the browser

//   const browser = await puppeteer.launch({

//     headless: false, // Set to true for headless mode

//     defaultViewport: null,

//     args: ['--start-maximized']

//   });

//   try {

//     const page = await browser.newPage();

//     // Navigate to BookMyShow

//     await page.goto('https://in.bookmyshow.com/');

//     console.log('Navigated to BookMyShow');

//     // Select city (Chennai)

//     await page.waitForSelector('.bwc__sc-1iyhybo-5');

//     await page.click('.bwc__sc-1iyhybo-5');

//     // Wait for city selection modal and select Chennai

//     await page.waitForSelector('[data-id="chennai"]');

//     await page.click('[data-id="chennai"]');

//     console.log('Selected Chennai');

//     // Search for Retro movie

//     await page.waitForSelector('input[placeholder="Search for Movies, Events, Plays, Sports and Activities"]');

//     await page.type('input[placeholder="Search for Movies, Events, Plays, Sports and Activities"]', 'Retro');

//     // Click on search result

//     await page.waitForSelector('.bwc__sc-1iyhybo-5.kqYtlq');

//     await page.click('.bwc__sc-1iyhybo-5.kqYtlq');

//     console.log('Searched for Retro movie');

//     // Wait for movie page to load and click on Book tickets

//     await page.waitForSelector('button.bwc__sc-dh558f-1');

//     await page.click('button.bwc__sc-dh558f-1');

//     console.log('Clicked on Book tickets');

//     // Select date (May 20th, 2025)

//     await page.waitForSelector('[data-date="20250520"]');

//     await page.click('[data-date="20250520"]');

//     console.log('Selected date: May 20, 2025');

//     // Select theater (PVR: Sathyam, Royapettah)

//     await page.waitForSelector('text/PVR: Sathyam, Royapettah');

//     await page.click('text/PVR: Sathyam, Royapettah');

//     console.log('Selected theater: PVR Sathyam, Royapettah');

//     // Select showtime (03:00 PM)

//     await page.waitForSelector('a[data-showtime-code*="0300"]');

//     await page.click('a[data-showtime-code*="0300"]');

//     console.log('Selected showtime: 03:00 PM');

//     // Accept terms dialog if appears

//     try {

//       await page.waitForSelector('button:has-text("Accept")', { timeout: 5000 });

//       await page.click('button:has-text("Accept")');

//       console.log('Accepted terms');

//     } catch (e) {

//       console.log('No terms dialog appeared');

//     }

//     // Select number of tickets (3)

//     await page.waitForSelector('div.quantity-selector');

//     await page.click('div.quantity-selector li:nth-child(3)'); // 3 tickets

//     await page.click('button#proceed-Qty');

//     console.log('Selected 3 tickets');

//     // Wait for seat selection page

//     await page.waitForSelector('.seatLayout');

//     console.log('Seat selection page loaded');

//     // Select premium balcony seats (G row, seats 15, 16, 17)

//     // Note: Seat IDs may vary, adjust selectors as needed

//     await page.waitForSelector('a#G_15_P');

//     await page.click('a#G_15_P');

//     await page.click('a#G_16_P');

//     await page.click('a#G_17_P');

//     console.log('Selected 3 premium balcony seats');

//     // Click on pay button

//     await page.waitForSelector('a#btmcntbook');

//     await page.click('a#btmcntbook');

//     console.log('Proceeding to payment');

//     // Fill in contact details

//     await page.waitForSelector('input[name="email"]');

//     await page.type('input[name="email"]', 'user@example.com');

//     await page.type('input[name="mobile"]', '9876543210');

//     await page.click('button.continue-btn');

//     console.log('Filled contact details');

//     // Select payment method (this part may vary based on your preference)

//     await page.waitForSelector('div.payment-methods');

//     await page.click('div.payment-method-tab[data-payment="card"]');

//     console.log('Selected payment method');

//     // Note: We stop here before actual payment

//     console.log('Booking process completed up to payment step');

//     // Uncomment below to take a screenshot of the final state

//     // await page.screenshot({ path: 'booking-completed.png' });

//     // Wait a bit before closing

//     await page.waitForTimeout(5000);

//   } catch (error) {

//     console.error('An error occurred:', error);

//     await page.screenshot({ path: 'error-screenshot.png' });

//   } finally {

//     await browser.close();

//     console.log('Browser closed');

//   }

// }

// bookMovieTickets().catch(console.error);
