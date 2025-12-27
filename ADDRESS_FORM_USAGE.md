# Address Form with Google Maps - Usage Guide

## ✅ Setup Complete!

The AddressForm component is now fully configured with Google Maps integration.

### 🔑 API Key Status

- **Status**: ✅ Configured
- **API Key**: `AIzaSyD15fDdmqNVINe8CtDWJkUJD3TNVIbg_B8`
- **Libraries**: Places API enabled
- **Region**: Restricted to Kenya (KE)

## 🚀 How to Use

### Adding an Address

1. **Navigate to Parent Details Page**

   - Go to Parents & Students
   - Click on any parent to view their details
   - Switch to the "Addresses" tab

2. **Click "Add Address" Button**

   - A dialog will open with two input methods

3. **Method 1: Search Location (Recommended)**

   - Select the "Search Location" tab
   - Choose an address type (Home, Office, Relative, Other)
   - Start typing an address in the search field
   - Google Maps will show autocomplete suggestions
   - Select an address from the dropdown
   - ✅ Coordinates will be filled automatically
   - A green confirmation box will appear showing the coordinates
   - Set status (Active/Inactive)
   - Choose if this is the primary address
   - Click "Add Address"

4. **Method 2: Manual Entry**
   - Select the "Manual Entry" tab
   - Choose an address type
   - Type the full address
   - Enter longitude (e.g., 36.8219)
   - Enter latitude (e.g., -1.2921)
   - Set status (Active/Inactive)
   - Choose if this is the primary address
   - Click "Add Address"

## 🗺️ Google Maps Features

### Autocomplete Search

- **Start typing**: As you type, suggestions appear instantly
- **Country-specific**: Limited to Kenya for relevant results
- **Real-time**: Updates as you type
- **Accurate coordinates**: Automatically extracted from selected location

### Address Types Supported

- 🏠 **Home** - Residential address
- 🏢 **Office / Work** - Work location
- 👨‍👩‍👧 **Relative** - Relative's address
- 📍 **Other** - Any other address type

## 💡 Tips for Best Results

### Using Google Maps Search

1. **Be specific**: Include neighborhood or area name (e.g., "Westlands, Nairobi")
2. **Wait for suggestions**: Don't press Enter; select from the dropdown
3. **Verify coordinates**: Check the green preview box to confirm
4. **Building names work**: You can search by building or landmark names

### Using Manual Entry

1. **Finding coordinates**:

   - Open Google Maps in a browser
   - Right-click on the location
   - Select "What's here?"
   - Coordinates will appear at the bottom
   - Copy latitude and longitude

2. **Coordinate format**:
   - Longitude: Positive for East, negative for West (Kenya: ~36.8)
   - Latitude: Positive for North, negative for South (Kenya: ~-1.3)

## 🎯 Examples

### Example 1: Search for Westlands, Nairobi

```
1. Click "Add Address"
2. Stay on "Search Location" tab
3. Type: "Westlands, Nairobi"
4. Select: "Westlands, Nairobi, Kenya" from dropdown
5. Coordinates auto-fill: Lng: 36.8073, Lat: -1.2659
6. Set type: "Office"
7. Click "Add Address"
```

### Example 2: Manual Entry for Specific Location

```
1. Click "Add Address"
2. Switch to "Manual Entry" tab
3. Address: "123 Kiambu Road, Nairobi"
4. Longitude: 36.8219
5. Latitude: -1.2921
6. Set type: "Home"
7. Mark as "Primary"
8. Click "Add Address"
```

## ⚠️ Troubleshooting

### "Loading Google Maps..." stays too long

- **Solution**: Switch to "Manual Entry" tab and enter coordinates manually
- **Reason**: Network issue or API loading delay

### No autocomplete suggestions appearing

- **Check**: Make sure you're typing in the search field (Search Location tab)
- **Wait**: Give it a few seconds for suggestions to load
- **Fallback**: Use Manual Entry if search isn't working

### Coordinates not filling automatically

- **Important**: You MUST select an address from the dropdown
- **Don't**: Just type and press Enter
- **Do**: Click on a suggestion from the list

### "Missing Coordinates" error

- **Reason**: You tried to submit without coordinates
- **Solution**: Either select a location from search OR enter them manually

## 🔒 Security Note

The API key is currently embedded in the code. For production:

- Consider using environment variables
- Set up API key restrictions in Google Cloud Console
- Limit usage to your domain only
- Monitor usage to prevent abuse

## 📊 Current Configuration

| Setting       | Value                         |
| ------------- | ----------------------------- |
| API Key       | Configured ✅                 |
| Libraries     | Places                        |
| Region        | Kenya (KE)                    |
| Address Types | Home, Office, Relative, Other |
| Validation    | Required coordinates          |
| Fallback      | Manual entry always available |

## 🎉 You're All Set!

The address form is ready to use with full Google Maps integration. Users can now easily search for locations and add addresses with accurate coordinates!
