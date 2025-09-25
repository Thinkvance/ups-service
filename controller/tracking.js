import vendorCredentials from "../Utilis/credentials.js";
import getVendorTrackingDetails from "../vendordata/vendor-api-data.js";
import getTrackingStatus from "../Utilis/dataformat.js";
import admin from "firebase-admin";

// Load service account JSON using fs/promises
const serviceAccount = {
  type: "service_account",
  project_id: "shiphitmobileapppickup-fb7e2",
  private_key_id: "0644b5011ef76b7fa4580fe78f4486ab63ed1d4d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTlqTcu+appYIB\n92IMWnFjRtRZ6zkdpXrjWSrRqL0BKq9IlFR3DJ7xUUoXYS4J9k74I2jR/s7rip6K\npo/2KX/E+7zPNWjQ4B2G8xMweLckI8P5wn4FtXW4xFt1gk2RowjjeUJpy8Hz9ZDi\nPaAXSD/p++EdYx+UXHOwdWW9O3XpBgjvK2J/gd86+o8A9mwkD2SqA2XWSMFqNgNn\nYGThZba/zKM3qiwY3pD0mBwETt1GLgQKe9w412S7fVnM4mnaUrW7MeMj7GATHcxR\n8y3J8E9VBWl9f/KsrIzz+mW0QYrk74Yc/TrsoMfHfAyc65igMazf7Afwhoue1bmg\nKKqKCa7PAgMBAAECggEACrr4pwEYesE1mkGGq9DoyZVNlTad2BtzFsiIDvq06xqh\nED5r5V9Me2x/ip2Xc7kVp1vhJ8hf8gelPRIJYJbmL4IDJ0PMI87Z1uT8GiWYR0rq\npP+KDvwO3+a4kXlt0zvANz9uo/+wJfeHXqt4mcJ32B2GYxkkM6ZX1gd+HpFymPVp\nUYbXC09ANrjciLpoZQ3xAVb71ao9QYDjVu3PVoFbkgsbrng9C6wr8mkFpeHdieG7\nzNWJqnJbenPUPCp7B2ullm9/0+RTbuxbSFd6Rw3Fb2CF8V0+8t1TaHcg8QIk/Hru\nYahhIum9UaGNhaWdpco/Tmq5vrhA96h6Xt6yPgIgMQKBgQD66Hr+/5oLHowolSKp\njRDFtuMM3OOmsXCfa0JqJI4cCMKQcODQmKJM0/ey845XS4Ag+B4Ctw8eYYD0hOTj\nGjFbR6w1ttwzWkz8fgKnWmHyfBfEXxeCa2esfqAnHpd1gfbck3exRyy+9ankv6ya\n8/0q3De/JlgV9IykD6cst5S9ewKBgQDX4ePEOzz+QtxjJ/kD6uUi7u/irPMhBtz8\n2N/Yk3EQHcTlNdTy0MV2HjXddRtViNyWrlDm2U/IZk04BZIPxSGNjwNsZvtWZ26S\n5MPNkNugkliL3P/QhxAzmYsvggwXKAHmhsByYK34WpyUr1/zRhvmEJx0rNHWkb3p\n1XAfFrvxvQKBgBpSJwz3DVbbRoK/WlqFBNxo2hqwVWVYOeNPYjE2Un4YYSi73qmj\nSWtb1SE9sZHwxqkuvh80yu459kgwZL56MfFMbIFaBHGSqH7YTTj3H01LvUaJXzL8\nR2zt/6j66ZKXJqlvAuBjAguqQ79OaDH9JHLJlUOFJzpuZA6V4cisHXtfAoGBAIUR\n44DY9v7PneOtBwzIJNfEqq9x5igMf/mHgWuRbtb9Upnq9cl6sMzfUFqizeeKhlaH\nOq0hdNFVZfHLVT5NSCJm7jhKvlCDTyBSzPMQgKDYtKX54uHZ7z2vPqFZKzS2330G\nwOd/+pyk1fG8rItbQuUshhRRVsNJcOQLQaKYM9+NAoGBAPCs+pxTT1w0d2ich4me\nOz8+K0CCjJbd/VmOfc3nt2v788fsVlP4P+b3X6SDiAr1as7zQb1v/22lomH8XFPS\nOOHl0XffpH5d7YyT3RxOMxa6WlUs9+ZqeE5MYbxvPNXoog81lN/+f4JVk07MykVZ\nCGNyvNCzfNEuozQEZ/6cdgAM\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fbsvc@shiphitmobileapppickup-fb7e2.iam.gserviceaccount.com",
  client_id: "109503023363384616572",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40shiphitmobileapppickup-fb7e2.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const getTrackingDetails = async (req, res) => {
  const { awbNumber, vendorawbnumber } = req.body;

  const requestBody = { ...vendorCredentials.UPS, AWBNo: vendorawbnumber };

  if (!awbNumber) {
    return res.status(400).json({ error: "awbNumber is required" });
  }

  try {
    const snapshot = await db
      .collection("pickup")
      .where("awbNumber", "==", awbNumber)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "No document found with that awbNumber" });
    }

    const docData = snapshot.docs[0].data();
    const statusTrail = getTrackingStatus(docData.status);

    if (docData.status !== "SHIPMENT CONNECTED") {
      return res.status(200).json({
        awbNumber,
        currentStatus: docData.status,
        statusTrail,
      });
    }

    // If SHIPMENT CONNECTED, get vendor details and return
    const vendorResponse = await getVendorTrackingDetails(
      docData.status,
      requestBody,
      statusTrail
    );
    return res.send(vendorResponse); // <-- return added here
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getTrackingDetails;
