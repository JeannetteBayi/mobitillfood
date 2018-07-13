package main

import (
	"fmt"
	"os"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// User represents a user on the database
type User struct {
	gorm.Model
	Email         string `gorm:"type:varchar(100);unique_index"`
	Password      string
	Organizations []Organization
}

// Organization represents companies owned by users
type Organization struct {
	gorm.Model
	UserID   int
	Name     string
	Devices  []Device
	Cashiers []Cashier
	Products []Product
	Orders   []Order
}

// Device is the machine the organization is using to run transactions
type Device struct {
	gorm.Model
	OrganizationID int
	Serial         string
	Name           string
}

// Cashier is someone operating a payment device
type Cashier struct {
	gorm.Model
	OrganizationID int
	Name           string
	Phone          string
	Password       string
	Roles          string
}

// Product is something the organization is selling
type Product struct {
	gorm.Model
	OrganizationID int
	Sku            int
	Description    string
	Location       string
	Price          int
	vat            float64
}

// ProductOrder describes a product and the amount of it that a customer is buying
type ProductOrder struct {
	gorm.Model
	ProductID     int
	OrderID       int
	Units         int
	AmountPerUnit float64
	AmountTotal   float64
}

// Order is a collection of product orders
type Order struct {
	ID             int
	OrganizationID int
	DeviceSerial   int
	CashierID      int
	Products       []ProductOrder
	Amount         float64
	Timestamp      time.Time
	Payed          bool
	Cancelled      bool
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      *time.Time
}

// Payment is money exchanged for Order
type Payment struct {
	gorm.Model
	OrderID   string
	Amount    float64
	Timestamp time.Time
	Mode      string
}

func dumpInterface(v interface{}) {
	fmt.Printf("%#v\n", v)
}

func createTables(db *gorm.DB) {
	db.CreateTable(&User{})
	db.CreateTable(&Organization{})
	db.CreateTable(&Device{})
	db.CreateTable(&Cashier{})
	db.CreateTable(&Product{})
	db.CreateTable(&ProductOrder{})
	db.CreateTable(&Order{})
	db.CreateTable(&Payment{})
}

func autoMigrate(db *gorm.DB) {
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Organization{})
	db.AutoMigrate(&Device{})
	db.AutoMigrate(&Cashier{})
	db.AutoMigrate(&Product{})
	db.AutoMigrate(&ProductOrder{})
	db.AutoMigrate(&Order{})
	db.AutoMigrate(&Payment{})
}

func main() {
	db, err := gorm.Open("postgres", "postgresql://root@localhost:26257/mobitillfoods?sslmode=disable")
	defer db.Close()
	if err != nil {
		panic(err)
	}

	args := os.Args
	if len(args) < 2 {
		fmt.Println("no command issed")
		return
	}
	cmd := args[1]

	switch cmd {
	case "create":
		{
			createTables(db)
			return
		}

	case "migrate":
		{
			autoMigrate(db)
			return
		}
	}
}
