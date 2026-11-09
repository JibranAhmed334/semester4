import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import Booth from "../models/booth.model.mjs";

test("Booth Model - Validation and Schema Rules", async (t) => {
    await t.test("should reject creating a booth without required fields", () => {
        const invalidBooth = new Booth({});
        const error = invalidBooth.validateSync();
        assert.ok(error, "Validation error must be raised");
        assert.ok(error.errors.boothNumber, "boothNumber is required");
        assert.ok(error.errors.location, "location is required");
        assert.ok(error.errors.expo, "expo reference is required");
    });

    await t.test("should reject invalid status values outside enum", () => {
        const invalidStatusBooth = new Booth({
            boothNumber: "A-999",
            location: "Hall A",
            expo: new mongoose.Types.ObjectId(),
            status: "sold_out" // Not in enum ["available", "reserved", "occupied"]
        });
        const error = invalidStatusBooth.validateSync();
        assert.ok(error, "Validation error must be raised for invalid status");
        assert.ok(error.errors.status, "status must belong to allowed enum");
    });

    await t.test("should set default values for hall, size, price, and status", () => {
        const validBooth = new Booth({
            boothNumber: "A-102",
            location: "Main Corridor",
            expo: new mongoose.Types.ObjectId()
        });
        const error = validBooth.validateSync();
        assert.ifError(error);
        assert.equal(validBooth.status, "available");
        assert.equal(validBooth.hall, "Hall A");
        assert.equal(validBooth.size, "10x10 ft");
        assert.equal(validBooth.price, 1200);
    });

    await t.test("should validate showcaseDetails and staffInfo length limits", () => {
        const longText = "a".repeat(1001);
        const boothWithTooLongDetails = new Booth({
            boothNumber: "A-103",
            location: "North Aisle",
            expo: new mongoose.Types.ObjectId(),
            showcaseDetails: longText
        });
        const error = boothWithTooLongDetails.validateSync();
        assert.ok(error, "Error expected when showcaseDetails exceeds length");
        assert.ok(error.errors.showcaseDetails);
    });
});

