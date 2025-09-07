import { DailyCashflowChart } from './charts/LineCharts';
import { MonthlyTotalsChart, DailySavingsChart } from './charts/BarCharts';
import { CashflowPie, IncomeSourcesPie, ExpensesPie } from './charts/PieCharts';

import { groupByDate, groupByMonth, totalGroup, expensesGroup, incomeGroup, SavingsPerDay } from './charts/utils/groupers';
import React, { useMemo } from 'react';

export default function MetricGraphs({ rows }) {
    const daily = useMemo(() => groupByDate(rows).map((d) => ({ date: d.date, Income: d.Income, Expenses: d.Expenses })), [rows]);
    const savings_per_day = SavingsPerDay(rows);
    const monthly = useMemo(() => groupByMonth(rows), [rows]);
    const totals = totalGroup(rows);
    const expenses_total_with_categories = expensesGroup(rows);
    const income_total_with_categories = incomeGroup(rows);
    
    return (
        <>
            <DailyCashflowChart data={daily} />
            <DailySavingsChart data={savings_per_day} />
            {monthly.length >= 2 ?<MonthlyTotalsChart data={monthly} /> : null }
            <CashflowPie usedata={totals} />
            <IncomeSourcesPie data={ income_total_with_categories }/>
            <ExpensesPie data={ expenses_total_with_categories }/>
        </>
    );
}