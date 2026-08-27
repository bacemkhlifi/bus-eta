# Bus Sfax Data Files

These CSV files mirror the current in-app pilot database.

- `line-catalog.csv`: bus code, French name, Arabic name, and main terminal.
- `corridors.csv`: selectable zones/corridors, covered line codes, max kilometer marker, speed assumptions, and reliability.
- `line-schedules.csv`: first departure, last departure, and frequency assumptions.

`verifiedPilot` means the corridor is directly supported by the current map/reference and is ready for controlled testing. `estimatedPilot` means it is usable for pilot estimation but should be validated with official SORETRAS route/schedule imports or field observations before public trust claims.
