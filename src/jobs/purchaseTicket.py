import requests

# API endpoint URL
url = (
    "https://sds.kartjis.id/api/v2/events/e4203ce3-23f1-459b-8e05-275d74486be7/tickets"
)

# Request body (replace placeholders with actual values)


# Set appropriate headers for PUT request (may be required by the API)
headers = {"Content-Type": "application/json"}  # Example header, adjust as needed

try:
    n = 1
    for j in range(1):
        tickets = []
        for i in range(40):
            tickets.append(
                {
                    "name": "Guest",  # Update with participant name
                    "email": "aahmdrvaii10@gmail.com",  # Update with valid email
                    "birthDate": 1068400355,  # Update with birth date in epoch format (seconds since epoch)
                    "phoneNumber": "0887040000",  # Update with phone number
                    "gender": "MALE",
                    "ticketId": "e7c43d24-02cc-41cb-8e76-5916031d49aa",  # Update with ticket ID
                    "quantity": 40,
                    "socialMedia": "_",
                    "address": "Makassar",
                }
            )
            n += 1

        request_body = {"tickets": tickets}
        response = requests.put(url, json=request_body, headers=headers)
        response.raise_for_status()  # Raise an exception for non-2xx status codes
        print("Request successful!")
        print(f"Status code: {response.status_code}")
        order_id = response.json()["data"]["id"]
        put_order = requests.put("https://sds.kartjis.id/api/orders/" + str(order_id))
        print("put order success")

except requests.exceptions.RequestException as e:
    print(e)
