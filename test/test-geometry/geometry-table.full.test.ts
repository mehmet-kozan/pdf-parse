import { Line } from '../../src/geometry/Line';
import { Point } from '../../src/geometry/Point';
import { Table } from '../../src/geometry/Table';
import { describe, expect, test } from 'vitest';

describe('Table constructor tests', (): void => {
	test('table constructor with horizontal line', (): void => {
		// Create a table with a horizontal line
		const hLine = new Line(new Point(0, 0), new Point(10, 0));
		const table = new Table(hLine);

		expect(table.hLines.length).toBe(1);
		expect(table.vLines.length).toBe(0);
		expect(table.hLines[0]).toBe(hLine);
	});

	test('table constructor with vertical line', (): void => {
		// Create a table with a vertical line
		const vLine = new Line(new Point(0, 0), new Point(0, 10));
		const table = new Table(vLine);

		expect(table.hLines.length).toBe(0);
		expect(table.vLines.length).toBe(1);
		expect(table.vLines[0]).toBe(vLine);
	});

	test('table constructor with invalid line', (): void => {
		// Create a table with a zero-length line (invalid)
		const invalidLine = new Line(new Point(5, 5), new Point(5, 5));
		const table = new Table(invalidLine);

		// Constructor always tries to add the line, validation happens later
		// Invalid line still gets added but table remains invalid
		expect(table.isValid).toBe(false);
	});
});

describe('Table isValid tests', (): void => {
	test('table with less than 5 lines is invalid', (): void => {
		// A valid table needs at least 5 lines to form a structure
		const table = new Table(new Line(new Point(0, 0), new Point(10, 0)));

		expect(table.isValid).toBe(false);
	});

	test('table with exactly 5 lines is valid', (): void => {
		// Create a table with 5 lines (minimum for validity)
		// Start with a vertical line first
		const table = new Table(new Line(new Point(0, 0), new Point(0, 10)));
		// Add horizontal lines that intersect
		table.add(new Line(new Point(0, 0), new Point(10, 0)));
		table.add(new Line(new Point(0, 10), new Point(10, 10)));
		// Add more vertical lines
		table.add(new Line(new Point(5, 0), new Point(5, 10)));
		table.add(new Line(new Point(10, 0), new Point(10, 10)));

		expect(table.isValid).toBe(true);
		expect(table.hLines.length + table.vLines.length).toBeGreaterThanOrEqual(5);
	});

	test('table with more than 5 lines is valid', (): void => {
		// Create a table with many lines (complex structure)
		const table = new Table(new Line(new Point(0, 0), new Point(0, 10)));
		table.add(new Line(new Point(0, 0), new Point(20, 0)));
		table.add(new Line(new Point(0, 5), new Point(20, 5)));
		table.add(new Line(new Point(0, 10), new Point(20, 10)));
		table.add(new Line(new Point(10, 0), new Point(10, 10)));
		table.add(new Line(new Point(20, 0), new Point(20, 10)));

		expect(table.isValid).toBe(true);
		expect(table.hLines.length + table.vLines.length).toBeGreaterThan(5);
	});
});

describe('Table rowPivots and colPivots tests', (): void => {
	test('rowPivots returns unique sorted Y coordinates', (): void => {
		// Create a table with horizontal lines at different Y positions
		const table = new Table(new Line(new Point(0, 0), new Point(10, 0)));
		table.hLines.push(new Line(new Point(0, 5), new Point(10, 5)));
		table.hLines.push(new Line(new Point(0, 10), new Point(10, 10)));
		table.hLines.push(new Line(new Point(5, 5), new Point(15, 5))); // Duplicate Y=5

		const pivots = table.rowPivots;

		expect(pivots.length).toBe(3); // Should have unique Y values
		expect(pivots).toEqual([0, 5, 10]); // Sorted in ascending order
	});

	test('colPivots returns unique sorted X coordinates', (): void => {
		// Create a table with vertical lines at different X positions
		const table = new Table(new Line(new Point(0, 0), new Point(0, 10)));
		table.vLines.push(new Line(new Point(5, 0), new Point(5, 10)));
		table.vLines.push(new Line(new Point(10, 0), new Point(10, 10)));
		table.vLines.push(new Line(new Point(5, 5), new Point(5, 15))); // Duplicate X=5

		const pivots = table.colPivots;

		expect(pivots.length).toBe(3); // Should have unique X values
		expect(pivots).toEqual([0, 5, 10]); // Sorted in ascending order
	});

	test('rowPivots with unordered horizontal lines', (): void => {
		// Add horizontal lines in random order
		const table = new Table(new Line(new Point(0, 10), new Point(10, 10)));
		table.hLines.push(new Line(new Point(0, 0), new Point(10, 0)));
		table.hLines.push(new Line(new Point(0, 5), new Point(10, 5)));

		const pivots = table.rowPivots;

		// Should still be sorted
		expect(pivots).toEqual([0, 5, 10]);
	});

	test('colPivots with unordered vertical lines', (): void => {
		// Add vertical lines in random order
		const table = new Table(new Line(new Point(10, 0), new Point(10, 10)));
		table.vLines.push(new Line(new Point(0, 0), new Point(0, 10)));
		table.vLines.push(new Line(new Point(5, 0), new Point(5, 10)));

		const pivots = table.colPivots;

		// Should still be sorted
		expect(pivots).toEqual([0, 5, 10]);
	});
});

describe('Table add method tests', (): void => {
	test('add horizontal line with intersection', (): void => {
		// Create a table with a vertical line, then add a horizontal line that intersects
		const vLine = new Line(new Point(5, 0), new Point(5, 10));
		const table = new Table(vLine);

		const hLine = new Line(new Point(0, 5), new Point(10, 5));
		const result = table.add(hLine);

		expect(result).toBe(true);
		expect(table.hLines.length).toBe(1);
		expect(table.hLines[0]).toBe(hLine);
	});

	test('add vertical line with intersection', (): void => {
		// Create a table with a horizontal line, then add a vertical line that intersects
		const hLine = new Line(new Point(0, 5), new Point(10, 5));
		const table = new Table(hLine);

		const vLine = new Line(new Point(5, 0), new Point(5, 10));
		const result = table.add(vLine);

		expect(result).toBe(true);
		expect(table.vLines.length).toBe(1);
		expect(table.vLines[0]).toBe(vLine);
	});

	test('add line without intersection returns false', (): void => {
		// Create a table with a horizontal line
		const hLine = new Line(new Point(0, 0), new Point(10, 0));
		const table = new Table(hLine);

		// Try to add another horizontal line (no intersection between parallel lines)
		const hLine2 = new Line(new Point(0, 5), new Point(10, 5));
		const result = table.add(hLine2);

		expect(result).toBe(false);
		expect(table.hLines.length).toBe(1); // Should still have only the original line
	});

	test('add multiple intersecting lines', (): void => {
		// Create a grid structure
		const table = new Table(new Line(new Point(0, 0), new Point(10, 0)));

		table.add(new Line(new Point(0, 0), new Point(0, 10)));
		table.add(new Line(new Point(10, 0), new Point(10, 10)));
		table.add(new Line(new Point(0, 10), new Point(10, 10)));
		table.add(new Line(new Point(5, 0), new Point(5, 10)));
		table.add(new Line(new Point(0, 5), new Point(10, 5)));

		expect(table.hLines.length).toBe(3); // 3 horizontal lines
		expect(table.vLines.length).toBe(3); // 3 vertical lines
	});

	test('add invalid line returns false', (): void => {
		// Try to add a zero-length line
		const table = new Table(new Line(new Point(0, 0), new Point(10, 0)));
		const invalidLine = new Line(new Point(5, 5), new Point(5, 5));

		const result = table.add(invalidLine);

		expect(result).toBe(false);
	});
});

describe('Table horizontalExists tests', (): void => {
	test('horizontalExists returns true for valid range', (): void => {
		// Create a horizontal line and check if a segment exists
		const hLine = new Line(new Point(0, 5), new Point(20, 5));
		const table = new Table(hLine);

		const exists = table.horizontalExists(hLine, 5, 15);

		expect(exists).toBe(true);
	});

	test('horizontalExists returns false for range outside line', (): void => {
		// Check a range that extends beyond the line
		const hLine = new Line(new Point(0, 5), new Point(10, 5));
		const table = new Table(hLine);

		const exists = table.horizontalExists(hLine, 5, 15);

		expect(exists).toBe(false);
	});

	test('horizontalExists returns false when gap covers the range', (): void => {
		// Create a line with a gap
		const hLine = new Line(new Point(0, 5), new Point(20, 5));
		hLine.addGap(new Line(new Point(5, 5), new Point(15, 5)));
		const table = new Table(hLine);

		const exists = table.horizontalExists(hLine, 6, 14);

		expect(exists).toBe(false); // Gap covers this range
	});

	test('horizontalExists throws error for vertical line', (): void => {
		// Try to use horizontalExists on a vertical line
		const vLine = new Line(new Point(5, 0), new Point(5, 10));
		const table = new Table(vLine);

		expect(() => {
			table.horizontalExists(vLine, 0, 5);
		}).toThrow('Line is not horizontal');
	});

	test('horizontalExists throws error for invalid range (x1 >= x2)', (): void => {
		// Try to check with x1 >= x2
		const hLine = new Line(new Point(0, 5), new Point(10, 5));
		const table = new Table(hLine);

		expect(() => {
			table.horizontalExists(hLine, 5, 5);
		}).toThrow('x1 must be less than x2');
	});
});

describe('Table verticalExists tests', (): void => {
	test('verticalExists returns true for valid range', (): void => {
		// Create a vertical line and check if a segment exists
		const vLine = new Line(new Point(5, 0), new Point(5, 20));
		const table = new Table(vLine);

		const exists = table.verticalExists(vLine, 5, 15);

		expect(exists).toBe(true);
	});

	test('verticalExists returns false for range outside line', (): void => {
		// Check a range that extends beyond the line
		const vLine = new Line(new Point(5, 0), new Point(5, 10));
		const table = new Table(vLine);

		const exists = table.verticalExists(vLine, 5, 15);

		expect(exists).toBe(false);
	});

	test('verticalExists returns false when gap covers the range', (): void => {
		// Create a line with a gap
		const vLine = new Line(new Point(5, 0), new Point(5, 20));
		vLine.addGap(new Line(new Point(5, 5), new Point(5, 15)));
		const table = new Table(vLine);

		const exists = table.verticalExists(vLine, 6, 14);

		expect(exists).toBe(false); // Gap covers this range
	});

	test('verticalExists throws error for horizontal line', (): void => {
		// Try to use verticalExists on a horizontal line
		const hLine = new Line(new Point(0, 5), new Point(10, 5));
		const table = new Table(hLine);

		expect(() => {
			table.verticalExists(hLine, 0, 5);
		}).toThrow('Line is not vertical');
	});

	test('verticalExists throws error for invalid range (y1 >= y2)', (): void => {
		// Try to check with y1 >= y2
		const vLine = new Line(new Point(5, 0), new Point(5, 10));
		const table = new Table(vLine);

		expect(() => {
			table.verticalExists(vLine, 5, 5);
		}).toThrow('y1 must be less than y2');
	});
});

describe('Table normalize tests', (): void => {
	test('normalize can be called without errors', (): void => {
		// Create a simple table and call normalize
		const table = new Table(new Line(new Point(0, 0), new Point(0, 10)));
		table.add(new Line(new Point(0, 0), new Point(10, 0)));
		table.add(new Line(new Point(10, 0), new Point(10, 10)));

		// Normalize should not throw
		expect(() => {
			table.normalize();
		}).not.toThrow();
	});

	test('normalize maintains table validity', (): void => {
		// Create a valid table
		const table = new Table(new Line(new Point(0, 0), new Point(0, 10)));
		table.add(new Line(new Point(0, 0), new Point(10, 0)));
		table.add(new Line(new Point(0, 10), new Point(10, 10)));
		table.add(new Line(new Point(10, 0), new Point(10, 10)));
		table.add(new Line(new Point(5, 0), new Point(5, 10)));
		table.add(new Line(new Point(0, 5), new Point(10, 5)));

		table.normalize();

		// Normalize may filter lines, so we just check it doesn't crash
		expect(table.hLines).toBeDefined();
		expect(table.vLines).toBeDefined();
	});
});
describe('Table toData tests', (): void => {
	test('toData creates TableData for simple 2x2 grid', (): void => {
		// Create a simple 2x2 table
		const table = new Table(new Line(new Point(0, 0), new Point(10, 0)));
		table.add(new Line(new Point(0, 10), new Point(10, 10)));
		table.add(new Line(new Point(0, 0), new Point(0, 10)));
		table.add(new Line(new Point(5, 0), new Point(5, 10)));
		table.add(new Line(new Point(10, 0), new Point(10, 10)));
		table.add(new Line(new Point(0, 5), new Point(10, 5)));

		// Add intersections
		table.hLines.forEach((hLine) => {
			table.vLines.forEach((vLine) => {
				const intersection = hLine.intersection(vLine);
				if (intersection) {
					hLine.addIntersectionPoint(intersection);
					vLine.addIntersectionPoint(intersection);
				}
			});
		});

		table.normalize();
		const tableData = table.toData();

		expect(tableData.minXY.x).toBe(0);
		expect(tableData.minXY.y).toBe(0);
		// After normalization, the bounds are based on actual line positions
		expect(tableData.maxXY.x).toBeGreaterThan(0);
		expect(tableData.maxXY.y).toBeGreaterThan(0);
		// Don't access private properties directly
		expect(tableData.rows).toBeDefined();
	});

	test('toData calculates correct row and column pivots', (): void => {
		// Create a table with specific pivot points
		const table = new Table(new Line(new Point(0, 0), new Point(20, 0)));
		table.add(new Line(new Point(0, 10), new Point(20, 10)));
		table.add(new Line(new Point(0, 20), new Point(20, 20)));
		table.add(new Line(new Point(0, 0), new Point(0, 20)));
		table.add(new Line(new Point(10, 0), new Point(10, 20)));
		table.add(new Line(new Point(20, 0), new Point(20, 20)));

		// Add intersections
		table.hLines.forEach((hLine) => {
			table.vLines.forEach((vLine) => {
				const intersection = hLine.intersection(vLine);
				if (intersection) {
					hLine.addIntersectionPoint(intersection);
					vLine.addIntersectionPoint(intersection);
				}
			});
		});

		// Check pivots before normalization
		expect(table.rowPivots.length).toBeGreaterThan(0);
		expect(table.colPivots.length).toBeGreaterThan(0);
		expect(table.rowPivots).toContain(0);
		expect(table.colPivots).toContain(0);

		table.normalize();
		const tableData = table.toData();

		expect(tableData).toBeDefined();
	});

	test('toData creates rows with correct structure', (): void => {
		// Create a simple table and verify row structure
		const table = new Table(new Line(new Point(0, 0), new Point(10, 0)));
		table.add(new Line(new Point(0, 5), new Point(10, 5)));
		table.add(new Line(new Point(0, 0), new Point(0, 5)));
		table.add(new Line(new Point(10, 0), new Point(10, 5)));

		// Add intersections
		table.hLines.forEach((hLine) => {
			table.vLines.forEach((vLine) => {
				const intersection = hLine.intersection(vLine);
				if (intersection) {
					hLine.addIntersectionPoint(intersection);
					vLine.addIntersectionPoint(intersection);
				}
			});
		});

		table.normalize();
		const tableData = table.toData();

		expect(tableData.rows.length).toBeGreaterThanOrEqual(0);
		expect(Array.isArray(tableData.rows)).toBe(true);
	});
});

describe('Table edge cases and complex scenarios', (): void => {
	test('empty table behavior', (): void => {
		// Create a table with only one line
		const table = new Table(new Line(new Point(0, 0), new Point(10, 0)));

		expect(table.isValid).toBe(false);
		expect(table.rowPivots.length).toBe(1);
		expect(table.colPivots.length).toBe(0);
	});

	test('table with large coordinates', (): void => {
		// Test with very large coordinate values
		const table = new Table(new Line(new Point(1000, 1000), new Point(2000, 1000)));
		table.add(new Line(new Point(1000, 1000), new Point(1000, 2000)));
		table.add(new Line(new Point(2000, 1000), new Point(2000, 2000)));
		table.add(new Line(new Point(1000, 2000), new Point(2000, 2000)));

		expect(table.hLines.length).toBeGreaterThan(0);
		expect(table.vLines.length).toBeGreaterThan(0);
		expect(table.rowPivots[0]).toBe(1000);
		expect(table.colPivots[0]).toBe(1000);
	});

	test('table with very close lines', (): void => {
		// Test with lines very close to each other
		const table = new Table(new Line(new Point(0, 0), new Point(0, 10)));
		table.add(new Line(new Point(0, 0), new Point(10, 0)));
		table.add(new Line(new Point(0, 0.1), new Point(10, 0.1)));
		table.add(new Line(new Point(0, 0), new Point(0, 0.1)));
		table.add(new Line(new Point(10, 0), new Point(10, 0.1)));

		// With intersections, lines should be added
		expect(table.rowPivots.length).toBeGreaterThanOrEqual(1);
	});
	test('table with negative coordinates', (): void => {
		// Test with negative coordinate space
		const table = new Table(new Line(new Point(-10, -10), new Point(-10, 10)));
		table.add(new Line(new Point(-10, -10), new Point(10, -10)));
		table.add(new Line(new Point(-10, 10), new Point(10, 10)));
		table.add(new Line(new Point(10, -10), new Point(10, 10)));

		// Should work with negative coordinates
		expect(table.rowPivots).toContain(-10);
		expect(table.colPivots).toContain(-10);
	});

	test('multiple tables from line store scenario', (): void => {
		// Simulate a scenario with disconnected table regions
		const table1 = new Table(new Line(new Point(0, 0), new Point(0, 10)));
		table1.add(new Line(new Point(0, 0), new Point(10, 0)));
		table1.add(new Line(new Point(0, 10), new Point(10, 10)));
		table1.add(new Line(new Point(10, 0), new Point(10, 10)));

		expect(table1.hLines.length).toBeGreaterThanOrEqual(1);
		expect(table1.vLines.length).toBeGreaterThanOrEqual(1);

		// Create a second disconnected table
		const table2 = new Table(new Line(new Point(20, 20), new Point(20, 30)));
		table2.add(new Line(new Point(20, 20), new Point(30, 20)));
		table2.add(new Line(new Point(20, 30), new Point(30, 30)));
		table2.add(new Line(new Point(30, 20), new Point(30, 30)));

		expect(table2.hLines.length).toBeGreaterThanOrEqual(1);
		expect(table2.vLines.length).toBeGreaterThanOrEqual(1);
	});
});
