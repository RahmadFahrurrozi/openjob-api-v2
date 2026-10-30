import os
from PIL import Image, ImageDraw, ImageFont

def create_erd():
    width = 1600
    height = 1100
    image = Image.new("RGBA", (width, height), (248, 250, 252, 255))
    draw = ImageDraw.Draw(image)

    # Title Banner
    draw.rectangle([(0, 0), (width, 80)], fill=(30, 41, 59))
    draw.text((40, 25), "ENTITY RELATIONSHIP DIAGRAM (ERD) - OPENJOB RESTFUL API VERSI 1", fill=(255, 255, 255))

    # Tables specification: (name, x, y, w, header_color, columns: [(name, type, tag)])
    tables = [
        {
            "name": "users",
            "x": 60, "y": 120, "w": 300,
            "header": (37, 99, 235),
            "columns": [
                ("id", "VARCHAR(50)", "PK"),
                ("name", "VARCHAR(255)", ""),
                ("email", "VARCHAR(255)", "UK"),
                ("password", "TEXT", ""),
                ("role", "VARCHAR(50)", ""),
                ("created_at", "TIMESTAMPTZ", ""),
                ("updated_at", "TIMESTAMPTZ", ""),
            ]
        },
        {
            "name": "authentications",
            "x": 60, "y": 420, "w": 300,
            "header": (100, 116, 139),
            "columns": [
                ("token", "TEXT", "PK"),
            ]
        },
        {
            "name": "companies",
            "x": 1240, "y": 120, "w": 300,
            "header": (13, 148, 136),
            "columns": [
                ("id", "VARCHAR(50)", "PK"),
                ("name", "VARCHAR(255)", ""),
                ("location", "VARCHAR(255)", ""),
                ("description", "TEXT", ""),
                ("created_at", "TIMESTAMPTZ", ""),
                ("updated_at", "TIMESTAMPTZ", ""),
            ]
        },
        {
            "name": "categories",
            "x": 1240, "y": 420, "w": 300,
            "header": (217, 119, 6),
            "columns": [
                ("id", "VARCHAR(50)", "PK"),
                ("name", "VARCHAR(255)", ""),
                ("description", "TEXT", ""),
                ("created_at", "TIMESTAMPTZ", ""),
                ("updated_at", "TIMESTAMPTZ", ""),
            ]
        },
        {
            "name": "jobs",
            "x": 650, "y": 120, "w": 320,
            "header": (79, 70, 229),
            "columns": [
                ("id", "VARCHAR(50)", "PK"),
                ("company_id", "VARCHAR(50)", "FK"),
                ("category_id", "VARCHAR(50)", "FK"),
                ("title", "VARCHAR(255)", ""),
                ("description", "TEXT", ""),
                ("job_type", "VARCHAR(50)", ""),
                ("experience_level", "VARCHAR(50)", ""),
                ("location_type", "VARCHAR(50)", ""),
                ("location_city", "VARCHAR(255)", ""),
                ("salary_min", "BIGINT", ""),
                ("salary_max", "BIGINT", ""),
                ("is_salary_visible", "BOOLEAN", ""),
                ("status", "VARCHAR(50)", ""),
                ("created_at", "TIMESTAMPTZ", ""),
                ("updated_at", "TIMESTAMPTZ", ""),
            ]
        },
        {
            "name": "applications",
            "x": 200, "y": 660, "w": 320,
            "header": (225, 29, 72),
            "columns": [
                ("id", "VARCHAR(50)", "PK"),
                ("user_id", "VARCHAR(50)", "FK"),
                ("job_id", "VARCHAR(50)", "FK"),
                ("status", "VARCHAR(50)", ""),
                ("created_at", "TIMESTAMPTZ", ""),
                ("updated_at", "TIMESTAMPTZ", ""),
            ]
        },
        {
            "name": "bookmarks",
            "x": 780, "y": 660, "w": 320,
            "header": (5, 150, 105),
            "columns": [
                ("id", "VARCHAR(50)", "PK"),
                ("user_id", "VARCHAR(50)", "FK"),
                ("job_id", "VARCHAR(50)", "FK"),
                ("created_at", "TIMESTAMPTZ", ""),
            ]
        },
    ]

    # Draw tables
    for tbl in tables:
        x, y, w = tbl["x"], tbl["y"], tbl["w"]
        row_h = 24
        header_h = 32
        total_h = header_h + len(tbl["columns"]) * row_h + 8

        # Box shadow & background
        draw.rounded_rectangle([(x+4, y+4), (x+w+4, y+total_h+4)], radius=8, fill=(226, 232, 240, 180))
        draw.rounded_rectangle([(x, y), (x+w, y+total_h)], radius=8, fill=(255, 255, 255), outline=(203, 213, 225), width=2)
        
        # Header
        draw.rounded_rectangle([(x, y), (x+w, y+header_h)], radius=8, fill=tbl["header"])
        draw.rectangle([(x, y+header_h-8), (x+w, y+header_h)], fill=tbl["header"])
        draw.text((x+15, y+8), tbl["name"].upper(), fill=(255, 255, 255))

        # Rows
        cur_y = y + header_h + 6
        for col_name, col_type, tag in tbl["columns"]:
            draw.text((x+15, cur_y), col_name, fill=(15, 23, 42))
            draw.text((x+140, cur_y), col_type, fill=(100, 116, 139))
            if tag:
                tag_bg = (239, 68, 68) if tag == "PK" else ((59, 130, 246) if tag == "FK" else (168, 85, 247))
                draw.rectangle([(x+w-35, cur_y-2), (x+w-10, cur_y+14)], fill=tag_bg)
                draw.text((x+w-32, cur_y), tag, fill=(255, 255, 255))
            cur_y += row_h

    # Draw Relation Connectors
    # 1. companies -> jobs
    draw.line([(1240, 180), (970, 180)], fill=(71, 85, 105), width=3)
    draw.text((1080, 160), "1:N (company_id)", fill=(51, 65, 85))

    # 2. categories -> jobs
    draw.line([(1240, 460), (1050, 460), (1050, 220), (970, 220)], fill=(71, 85, 105), width=3)
    draw.text((1060, 320), "1:N (category_id)", fill=(51, 65, 85))

    # 3. users -> applications
    draw.line([(210, 330), (210, 660)], fill=(71, 85, 105), width=3)
    draw.text((120, 520), "1:N (user_id)", fill=(51, 65, 85))

    # 4. jobs -> applications
    draw.line([(700, 530), (700, 600), (450, 600), (450, 660)], fill=(71, 85, 105), width=3)
    draw.text((540, 580), "1:N (job_id)", fill=(51, 65, 85))

    # 5. users -> bookmarks
    draw.line([(360, 280), (580, 280), (580, 720), (780, 720)], fill=(71, 85, 105), width=3)
    draw.text((590, 700), "1:N (user_id)", fill=(51, 65, 85))

    # 6. jobs -> bookmarks
    draw.line([(850, 530), (850, 660)], fill=(71, 85, 105), width=3)
    draw.text((860, 580), "1:N (job_id)", fill=(51, 65, 85))

    output_path = os.path.join(os.getcwd(), "ERD-OpenJob-versi-1.png")
    image.save(output_path, "PNG")
    print(f"ERD successfully saved to {output_path}")

if __name__ == "__main__":
    create_erd()
