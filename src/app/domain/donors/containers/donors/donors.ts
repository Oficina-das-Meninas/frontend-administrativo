import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import {
  DataPage,
  TableColumn,
} from '../../../../shared/models/data-table-helpers';
import { Donor } from '../../models/donor';
import { DonorBadgePipe } from '../../pipes/donor-badge-pipe';
import { DonorService } from '../../services/donor-service';
import { DonorFilters } from '../../models/donor-filters';

@Component({
  selector: 'app-donors',
  imports: [CommonModule, DataTable, DonorBadgePipe],
  templateUrl: './donors.html',
  styleUrls: ['./donors.scss'],
})
export class Donors {
  @ViewChild('totalDonatedTemplate') totalDonatedTemplate!: TemplateRef<any>;
  @ViewChild('donorBadgeTemplate') donorBadgeTemplate!: TemplateRef<any>;

  donors$: Observable<DataPage<Donor>> | null = null;

  columns: TableColumn[] = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Celular' },
    { key: 'totalDonated', header: 'Valor doado', type: 'currency', sortable: true, sortField: 'totalDonated' },
    { key: 'points', header: 'Pontos' },
    { key: 'badge', header: 'Badge' },
  ];

  searchTerm = '';
  pageIndex = 0;
  pageSize = 10;
  currentFilters: DonorFilters = {};
  currentSortField: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  private donorService = inject(DonorService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadDonorsWithFilters();
  }

  ngAfterViewInit() {
    if (this.totalDonatedTemplate) {
      this.columns[3].cellTemplate = this.totalDonatedTemplate;
    }
    if (this.donorBadgeTemplate) {
      this.columns[5].cellTemplate = this.donorBadgeTemplate;
    }
    this.cdr.detectChanges();
  }

  loadDonorsWithFilters() {
    this.currentFilters = {
      ...this.currentFilters,
      page: this.pageIndex,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
    };

    this.donors$ = this.donorService.list(this.currentFilters);
  }

  onPageChange(pageEvent: any) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.loadDonorsWithFilters();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.loadDonorsWithFilters();
  }

  onClearSearch() {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadDonorsWithFilters();
  }

  onClearFilters() {
    this.searchTerm = '';
    this.currentFilters = {};
    this.pageIndex = 0;
    this.cdr.detectChanges();
    this.loadDonorsWithFilters();
  }

  onSortChange(event: { sortField: string; sortDirection: 'asc' | 'desc' }) {
    this.currentSortField = event.sortField;
    this.currentSortDirection = event.sortDirection;
    this.currentFilters['sortField'] = event.sortField;
    this.currentFilters['sortDirection'] = event.sortDirection;
    this.pageIndex = 0;
    this.loadDonorsWithFilters();
  }

  private cleanEmptyFilters(
    filters: Record<string, unknown>
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        return (
          value !== undefined &&
          value !== null &&
          !(Array.isArray(value) && value.length === 0)
        );
      })
    );
  }

  onSelectFiltersChange(selected: Record<string, unknown>) {
    const { status, type, badge, ...otherFilters } = this.currentFilters as Record<
      string,
      unknown
    >;

    this.currentFilters = {
      ...this.cleanEmptyFilters(otherFilters),
      ...selected,
    } as DonorFilters;

    this.pageIndex = 0;
    this.loadDonorsWithFilters();
  }

  getBadgeStyles(badge: string): { bgColor: string; textColor: string } {
    const colors: Record<string, { bgColor: string; textColor: string }> = {
      semente: { bgColor: 'bg-[#8b6f47] ', textColor: 'text-white' },
      broto: { bgColor: 'bg-[#588157]', textColor: 'text-white' },
      margarida: {
        bgColor: 'margarida-badge',
        textColor: 'text-[#2d2416]',
      },
    };
    return colors[badge?.toLowerCase()] || colors['semente'];
  }
}
