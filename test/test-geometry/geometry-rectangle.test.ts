import { describe, expect, test } from 'vitest';
import { Point } from '../../src/geometry/Point';
import { Rectangle } from '../../src/geometry/Rectangle';

describe('Rectangle basic tests', (): void => {
	test('rectangle constructor creates correct instance', (): void => {
		// Create a rectangle at origin with specific dimensions
		const rect = new Rectangle(new Point(0, 0), 10, 20);

		expect(rect.from).toEqual(new Point(0, 0));
		expect(rect.width).toBe(10);
		expect(rect.height).toBe(20);
	});

	test('rectangle with negative starting point', (): void => {
		// Test rectangle in negative coordinate space
		const rect = new Rectangle(new Point(-5, -10), 15, 25);

		expect(rect.from).toEqual(new Point(-5, -10));
		expect(rect.width).toBe(15);
		expect(rect.height).toBe(25);
	});

	test('rectangle to point calculation', (): void => {
		// Verify that 'to' property correctly calculates the opposite corner
		const rect = new Rectangle(new Point(10, 20), 30, 40);
		const toPoint = rect.to;

		expect(toPoint.x).toBe(40); // 10 + 30
		expect(toPoint.y).toBe(60); // 20 + 40
	});

	test('zero-sized rectangle', (): void => {
		// Edge case: rectangle with zero dimensions
		const rect = new Rectangle(new Point(5, 5), 0, 0);

		expect(rect.from).toEqual(new Point(5, 5));
		expect(rect.to).toEqual(new Point(5, 5));
		expect(rect.width).toBe(0);
		expect(rect.height).toBe(0);
	});
});

describe('Rectangle getLines tests', (): void => {
	test('getLines returns four edges for normal rectangle', (): void => {
		// Standard rectangle should produce 4 valid lines (edges)
		const rect = new Rectangle(new Point(0, 0), 10, 10);
		const lines = rect.getLines();

		expect(lines.length).toBe(4);

		// Verify all lines are valid
		lines.forEach((line) => {
			expect(line.valid).toBe(true);
		});
	});

	test('getLines creates correct boundary lines', (): void => {
		// Verify the exact positions of the rectangle edges
		const rect = new Rectangle(new Point(5, 5), 10, 20);
		const lines = rect.getLines();

		// Expected lines: top, left, right, bottom edges
		expect(lines.length).toBe(4);

		// Check that lines form a closed rectangle
		const allPoints = new Set<string>();
		lines.forEach((line) => {
			allPoints.add(`${line.from.x},${line.from.y}`);
			allPoints.add(`${line.to.x},${line.to.y}`);
		});

		// A rectangle should have exactly 4 unique corner points
		expect(allPoints.size).toBe(4);
	});
	test('getLines filters out invalid zero-length lines', (): void => {
		// When rectangle has zero width or height, some lines become invalid
		const rectZeroWidth = new Rectangle(new Point(0, 0), 0, 10);
		const linesZeroWidth = rectZeroWidth.getLines();

		// Only vertical lines should be valid when width is 0
		expect(linesZeroWidth.length).toBeLessThan(4);

		const rectZeroHeight = new Rectangle(new Point(0, 0), 10, 0);
		const linesZeroHeight = rectZeroHeight.getLines();

		// Only horizontal lines should be valid when height is 0
		expect(linesZeroHeight.length).toBeLessThan(4);
	});

	test('getLines for large rectangle', (): void => {
		// Test with large dimensions
		const rect = new Rectangle(new Point(0, 0), 1000, 2000);
		const lines = rect.getLines();

		expect(lines.length).toBe(4);

		// Verify line lengths match rectangle dimensions
		let hasHorizontalLine = false;
		let hasVerticalLine = false;

		lines.forEach((line) => {
			if (line.length === 1000) hasHorizontalLine = true;
			if (line.length === 2000) hasVerticalLine = true;
		});

		expect(hasHorizontalLine).toBe(true);
		expect(hasVerticalLine).toBe(true);
	});
});

describe('Rectangle transform tests', (): void => {
	test('transform with identity matrix keeps rectangle unchanged', (): void => {
		// Identity matrix: [1, 0, 0, 1, 0, 0] should not change the rectangle
		const rect = new Rectangle(new Point(10, 20), 30, 40);
		const identityMatrix = [1, 0, 0, 1, 0, 0];

		rect.transform(identityMatrix);

		expect(rect.from.x).toBeCloseTo(10, 5);
		expect(rect.from.y).toBeCloseTo(20, 5);
		expect(rect.width).toBeCloseTo(30, 5);
		expect(rect.height).toBeCloseTo(40, 5);
	});

	test('transform with translation matrix', (): void => {
		// Translation matrix: [1, 0, 0, 1, tx, ty] moves the rectangle
		const rect = new Rectangle(new Point(0, 0), 10, 20);
		const translationMatrix = [1, 0, 0, 1, 15, 25];

		rect.transform(translationMatrix);

		expect(rect.from.x).toBeCloseTo(15, 5);
		expect(rect.from.y).toBeCloseTo(25, 5);
		expect(rect.width).toBeCloseTo(10, 5);
		expect(rect.height).toBeCloseTo(20, 5);
	});

	test('transform with scaling matrix', (): void => {
		// Scaling matrix: [sx, 0, 0, sy, 0, 0] scales the rectangle
		const rect = new Rectangle(new Point(10, 10), 20, 30);
		const scalingMatrix = [2, 0, 0, 2, 0, 0]; // Scale by 2x

		rect.transform(scalingMatrix);

		expect(rect.from.x).toBeCloseTo(20, 5);
		expect(rect.from.y).toBeCloseTo(20, 5);
		expect(rect.width).toBeCloseTo(40, 5);
		expect(rect.height).toBeCloseTo(60, 5);
	});

	test('transform with negative scaling (reflection)', (): void => {
		// Negative scaling flips the rectangle
		const rect = new Rectangle(new Point(10, 10), 20, 30);
		const reflectionMatrix = [-1, 0, 0, 1, 0, 0]; // Reflect across Y-axis

		rect.transform(reflectionMatrix);

		// The rectangle should be reflected, with 'from' adjusted to min coordinates
		expect(rect.width).toBeCloseTo(20, 5);
		expect(rect.height).toBeCloseTo(30, 5);
		// After reflection, the from point should be adjusted
		expect(rect.from.x).toBeCloseTo(-30, 5); // min of -10 and -30
	});

	test('transform with combined translation and scaling', (): void => {
		// Complex transformation combining scale and translate
		const rect = new Rectangle(new Point(5, 5), 10, 10);
		const complexMatrix = [2, 0, 0, 3, 10, 20]; // Scale x2 in X, x3 in Y, then translate

		rect.transform(complexMatrix);

		expect(rect.from.x).toBeCloseTo(20, 5); // (5 * 2) + 10
		expect(rect.from.y).toBeCloseTo(35, 5); // (5 * 3) + 20
		expect(rect.width).toBeCloseTo(20, 5); // 10 * 2
		expect(rect.height).toBeCloseTo(30, 5); // 10 * 3
	});

	test('transform returns this for method chaining', (): void => {
		// Verify that transform returns the same instance for chaining
		const rect = new Rectangle(new Point(0, 0), 10, 10);
		const result = rect.transform([1, 0, 0, 1, 5, 5]);

		expect(result).toBe(rect);
	});

	test('transform handles rotation matrix correctly', (): void => {
		// Rotation can change both width and height due to bounding box calculation
		const rect = new Rectangle(new Point(0, 0), 10, 20);
		// 90-degree rotation: [0, 1, -1, 0, 0, 0]
		const rotationMatrix = [0, 1, -1, 0, 0, 0];

		rect.transform(rotationMatrix);

		// After 90-degree rotation, dimensions are swapped and coordinates adjusted
		expect(rect.width).toBeCloseTo(20, 5);
		expect(rect.height).toBeCloseTo(10, 5);
	});
});

describe('Rectangle edge cases and special scenarios', (): void => {
	test('very small rectangle dimensions', (): void => {
		// Test with very small but non-zero dimensions
		const rect = new Rectangle(new Point(0, 0), 0.001, 0.002);

		expect(rect.width).toBe(0.001);
		expect(rect.height).toBe(0.002);
		expect(rect.to.x).toBeCloseTo(0.001, 6);
		expect(rect.to.y).toBeCloseTo(0.002, 6);
	});

	test('rectangle with large coordinates', (): void => {
		// Test with very large coordinate values
		const rect = new Rectangle(new Point(1000000, 2000000), 500000, 600000);

		expect(rect.from.x).toBe(1000000);
		expect(rect.from.y).toBe(2000000);
		expect(rect.to.x).toBe(1500000);
		expect(rect.to.y).toBe(2600000);
	});

	test('multiple transforms applied sequentially', (): void => {
		// Apply multiple transformations in sequence
		const rect = new Rectangle(new Point(0, 0), 10, 10);

		// First translate
		rect.transform([1, 0, 0, 1, 5, 5]);
		expect(rect.from.x).toBeCloseTo(5, 5);
		expect(rect.from.y).toBeCloseTo(5, 5);

		// Then scale
		rect.transform([2, 0, 0, 2, 0, 0]);
		expect(rect.from.x).toBeCloseTo(10, 5);
		expect(rect.from.y).toBeCloseTo(10, 5);
		expect(rect.width).toBeCloseTo(20, 5);
		expect(rect.height).toBeCloseTo(20, 5);
	});

	test('rectangle area calculation concept', (): void => {
		// While Rectangle doesn't have an area() method, we can verify dimensions
		const rect = new Rectangle(new Point(0, 0), 15, 25);
		const expectedArea = 15 * 25;
		const calculatedArea = rect.width * rect.height;

		expect(calculatedArea).toBe(expectedArea);
		expect(calculatedArea).toBe(375);
	});
});
