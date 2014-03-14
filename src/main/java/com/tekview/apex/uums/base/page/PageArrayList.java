/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : PageArrayList.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.page;

import java.util.*;
public class PageArrayList<E> implements PageList<E> {
	private static final long serialVersionUID = 1L;
	private long totalCount;
    private List<E> list;

    /**
     * 构造
     *
     * @param totalCount 总数
     * @param list       列表
     */
    public PageArrayList(long totalCount, List<E> list) {
        this.totalCount = totalCount;
        this.list = list;
    }

    /**
     * Returns the number of elements in this list.  If this list contains
     * more than <tt>Integer.MAX_VALUE</tt> elements, returns
     * <tt>Integer.MAX_VALUE</tt>.
     *
     * @return the number of elements in this list.
     */
    public int size() {
        return list.size();
    }

    /**
     * Removes all of the elements from this list (optional operation).  This
     * list will be empty after this call returns (unless it throws an
     * exception).
     *
     * @throws UnsupportedOperationException if the <tt>clear</tt> method is
     *                                       not supported by this list.
     */
    public void clear() {
        list.clear();
    }

    /**
     * Returns <tt>true</tt> if this list contains no elements.
     *
     * @return <tt>true</tt> if this list contains no elements.
     */
    public boolean isEmpty() {
        return list.isEmpty();
    }

    /**
     * Returns an array containing all of the elements in this list in proper
     * sequence.  Obeys the general contract of the
     * <tt>Collection.toArray</tt> method.
     *
     * @return an array containing all of the elements in this list in proper
     *         sequence.
     */
    public Object[] toArray() {
        return list.toArray();
    }

    /**
     * Returns the element at the specified position in this list.
     *
     * @param index index of element to return.
     * @return the element at the specified position in this list.
     * @throws IndexOutOfBoundsException if the index is out of range (index
     *                                   &lt; 0 || index &gt;= size()).
     */
    public E get(int index) {
        return list.get(index);
    }

    /**
     * Removes the element at the specified position in this list (optional
     * operation).  Shifts any subsequent elements to the left (subtracts one
     * from their indices).  Returns the element that was removed from the
     * list.
     *
     * @param index the index of the element to removed.
     * @return the element previously at the specified position.
     * @throws UnsupportedOperationException if the <tt>remove</tt> method is
     *                                       not supported by this list.
     * @throws IndexOutOfBoundsException     if the index is out of range (index
     *                                       &lt; 0 || index &gt;= size()).
     */
    public E remove(int index) {
        return list.remove(index);
    }

    /**
     * Inserts the specified element at the specified position in this list
     * (optional operation).  Shifts the element currently at that position
     * (if any) and any subsequent elements to the right (adds one to their
     * indices).
     *
     * @param index   index at which the specified element is to be inserted.
     * @param element element to be inserted.
     * @throws UnsupportedOperationException if the <tt>add</tt> method is not
     *                                       supported by this list.
     * @throws ClassCastException            if the class of the specified element
     *                                       prevents it from being added to this list.
     * @throws NullPointerException          if the specified element is null and
     *                                       this list does not support null elements.
     * @throws IllegalArgumentException      if some aspect of the specified
     *                                       element prevents it from being added to this list.
     * @throws IndexOutOfBoundsException     if the index is out of range
     *                                       (index &lt; 0 || index &gt; size()).
     */
    public void add(int index, E element) {
        list.add(index, element);
    }

    /**
     * Returns the index in this list of the first occurrence of the specified
     * element, or -1 if this list does not contain this element.
     * More formally, returns the lowest index <tt>i</tt> such that
     * <tt>(o==null ? get(i)==null : o.equals(get(i)))</tt>,
     * or -1 if there is no such index.
     *
     * @param o element to search for.
     * @return the index in this list of the first occurrence of the specified
     *         element, or -1 if this list does not contain this element.
     * @throws ClassCastException   if the type of the specified element
     *                              is incompatible with this list (optional).
     * @throws NullPointerException if the specified element is null and this
     *                              list does not support null elements (optional).
     */
    public int indexOf(Object o) {
        return list.indexOf(o);
    }

    /**
     * Returns the index in this list of the last occurrence of the specified
     * element, or -1 if this list does not contain this element.
     * More formally, returns the highest index <tt>i</tt> such that
     * <tt>(o==null ? get(i)==null : o.equals(get(i)))</tt>,
     * or -1 if there is no such index.
     *
     * @param o element to search for.
     * @return the index in this list of the last occurrence of the specified
     *         element, or -1 if this list does not contain this element.
     * @throws ClassCastException   if the type of the specified element
     *                              is incompatible with this list (optional).
     * @throws NullPointerException if the specified element is null and this
     *                              list does not support null elements (optional).
     */
    public int lastIndexOf(Object o) {
        return list.lastIndexOf(o);
    }

    /**
     * Appends the specified element to the end of this list (optional
     * operation). <p>
     * <p/>
     * Lists that support this operation may place limitations on what
     * elements may be added to this list.  In particular, some
     * lists will refuse to add null elements, and others will impose
     * restrictions on the type of elements that may be added.  List
     * classes should clearly specify in their documentation any restrictions
     * on what elements may be added.
     *
     * @param o element to be appended to this list.
     * @return <tt>true</tt> (as per the general contract of the
     *         <tt>Collection.add</tt> method).
     * @throws UnsupportedOperationException if the <tt>add</tt> method is not
     *                                       supported by this list.
     * @throws ClassCastException            if the class of the specified element
     *                                       prevents it from being added to this list.
     * @throws NullPointerException          if the specified element is null and this
     *                                       list does not support null elements.
     * @throws IllegalArgumentException      if some aspect of this element
     *                                       prevents it from being added to this list.
     */
    public boolean add(E o) {
        return list.add(o);
    }

    /**
     * Returns <tt>true</tt> if this list contains the specified element.
     * More formally, returns <tt>true</tt> if and only if this list contains
     * at least one element <tt>e</tt> such that
     * <tt>(o==null&nbsp;?&nbsp;e==null&nbsp;:&nbsp;o.equals(e))</tt>.
     *
     * @param o element whose presence in this list is to be tested.
     * @return <tt>true</tt> if this list contains the specified element.
     * @throws ClassCastException   if the type of the specified element
     *                              is incompatible with this list (optional).
     * @throws NullPointerException if the specified element is null and this
     *                              list does not support null elements (optional).
     */
    public boolean contains(Object o) {
        return list.contains(o);
    }

    /**
     * Removes the first occurrence in this list of the specified element
     * (optional operation).  If this list does not contain the element, it is
     * unchanged.  More formally, removes the element with the lowest index i
     * such that <tt>(o==null ? get(i)==null : o.equals(get(i)))</tt> (if
     * such an element exists).
     *
     * @param o element to be removed from this list, if present.
     * @return <tt>true</tt> if this list contained the specified element.
     * @throws ClassCastException            if the type of the specified element
     *                                       is incompatible with this list (optional).
     * @throws NullPointerException          if the specified element is null and this
     *                                       list does not support null elements (optional).
     * @throws UnsupportedOperationException if the <tt>remove</tt> method is
     *                                       not supported by this list.
     */
    public boolean remove(Object o) {
        return list.remove(o);
    }

    /**
     * Inserts all of the elements in the specified collection into this
     * list at the specified position (optional operation).  Shifts the
     * element currently at that position (if any) and any subsequent
     * elements to the right (increases their indices).  The new elements
     * will appear in this list in the order that they are returned by the
     * specified collection's iterator.  The behavior of this operation is
     * unspecified if the specified collection is modified while the
     * operation is in progress.  (Note that this will occur if the specified
     * collection is this list, and it's nonempty.)
     *
     * @param index index at which to insert first element from the specified
     *              collection.
     * @param c     elements to be inserted into this list.
     * @return <tt>true</tt> if this list changed as a result of the call.
     * @throws UnsupportedOperationException if the <tt>addAll</tt> method is
     *                                       not supported by this list.
     * @throws ClassCastException            if the class of one of elements of the
     *                                       specified collection prevents it from being added to this
     *                                       list.
     * @throws NullPointerException          if the specified collection contains one
     *                                       or more null elements and this list does not support null
     *                                       elements, or if the specified collection is <tt>null</tt>.
     * @throws IllegalArgumentException      if some aspect of one of elements of
     *                                       the specified collection prevents it from being added to
     *                                       this list.
     * @throws IndexOutOfBoundsException     if the index is out of range (index
     *                                       &lt; 0 || index &gt; size()).
     */
    public boolean addAll(int index, Collection<? extends E> c) {
        return list.addAll(index, c);
    }

    /**
     * Appends all of the elements in the specified collection to the end of
     * this list, in the order that they are returned by the specified
     * collection's iterator (optional operation).  The behavior of this
     * operation is unspecified if the specified collection is modified while
     * the operation is in progress.  (Note that this will occur if the
     * specified collection is this list, and it's nonempty.)
     *
     * @param c collection whose elements are to be added to this list.
     * @return <tt>true</tt> if this list changed as a result of the call.
     * @throws UnsupportedOperationException if the <tt>addAll</tt> method is
     *                                       not supported by this list.
     * @throws ClassCastException            if the class of an element in the specified
     *                                       collection prevents it from being added to this list.
     * @throws NullPointerException          if the specified collection contains one
     *                                       or more null elements and this list does not support null
     *                                       elements, or if the specified collection is <tt>null</tt>.
     * @throws IllegalArgumentException      if some aspect of an element in the
     *                                       specified collection prevents it from being added to this
     *                                       list.
     * @see #add(Object)
     */
    public boolean addAll(Collection<? extends E> c) {
        return list.addAll(c);
    }

    /**
     * Returns <tt>true</tt> if this list contains all of the elements of the
     * specified collection.
     *
     * @param c collection to be checked for containment in this list.
     * @return <tt>true</tt> if this list contains all of the elements of the
     *         specified collection.
     * @throws ClassCastException   if the types of one or more elements
     *                              in the specified collection are incompatible with this
     *                              list (optional).
     * @throws NullPointerException if the specified collection contains one
     *                              or more null elements and this list does not support null
     *                              elements (optional).
     * @throws NullPointerException if the specified collection is
     *                              <tt>null</tt>.
     * @see #contains(Object)
     */
    public boolean containsAll(Collection<?> c) {
        return list.containsAll(c);
    }

    /**
     * Removes from this list all the elements that are contained in the
     * specified collection (optional operation).
     *
     * @param c collection that defines which elements will be removed from
     *          this list.
     * @return <tt>true</tt> if this list changed as a result of the call.
     * @throws UnsupportedOperationException if the <tt>removeAll</tt> method
     *                                       is not supported by this list.
     * @throws ClassCastException            if the types of one or more elements
     *                                       in this list are incompatible with the specified
     *                                       collection (optional).
     * @throws NullPointerException          if this list contains one or more
     *                                       null elements and the specified collection does not support
     *                                       null elements (optional).
     * @throws NullPointerException          if the specified collection is
     *                                       <tt>null</tt>.
     * @see #remove(Object)
     * @see #contains(Object)
     */
    public boolean removeAll(Collection<?> c) {
        return list.removeAll(c);
    }

    /**
     * Retains only the elements in this list that are contained in the
     * specified collection (optional operation).  In other words, removes
     * from this list all the elements that are not contained in the specified
     * collection.
     *
     * @param c collection that defines which elements this set will retain.
     * @return <tt>true</tt> if this list changed as a result of the call.
     * @throws UnsupportedOperationException if the <tt>retainAll</tt> method
     *                                       is not supported by this list.
     * @throws ClassCastException            if the types of one or more elements
     *                                       in this list are incompatible with the specified
     *                                       collection (optional).
     * @throws NullPointerException          if this list contains one or more
     *                                       null elements and the specified collection does not support
     *                                       null elements (optional).
     * @throws NullPointerException          if the specified collection is
     *                                       <tt>null</tt>.
     * @see #remove(Object)
     * @see #contains(Object)
     */
    public boolean retainAll(Collection<?> c) {
        return list.retainAll(c);
    }

    /**
     * Returns an iterator over the elements in this list in proper sequence.
     *
     * @return an iterator over the elements in this list in proper sequence.
     */
    public Iterator<E> iterator() {
        return list.iterator();
    }

    /**
     * Returns a view of the portion of this list between the specified
     * <tt>fromIndex</tt>, inclusive, and <tt>toIndex</tt>, exclusive.  (If
     * <tt>fromIndex</tt> and <tt>toIndex</tt> are equal, the returned list is
     * empty.)  The returned list is backed by this list, so non-structural
     * changes in the returned list are reflected in this list, and vice-versa.
     * The returned list supports all of the optional list operations supported
     * by this list.<p>
     * <p/>
     * This method eliminates the need for explicit range operations (of
     * the sort that commonly exist for arrays).   Any operation that expects
     * a list can be used as a range operation by passing a subList view
     * instead of a whole list.  For example, the following idiom
     * removes a range of elements from a list:
     * <pre>
     *         list.subList(from, to).clear();
     * </pre>
     * Similar idioms may be constructed for <tt>indexOf</tt> and
     * <tt>lastIndexOf</tt>, and all of the algorithms in the
     * <tt>Collections</tt> class can be applied to a subList.<p>
     * <p/>
     * The semantics of the list returned by this method become undefined if
     * the backing list (i.e., this list) is <i>structurally modified</i> in
     * any way other than via the returned list.  (Structural modifications are
     * those that change the size of this list, or otherwise perturb it in such
     * a fashion that iterations in progress may yield incorrect results.)
     *
     * @param fromIndex low endpoint (inclusive) of the subList.
     * @param toIndex   high endpoint (exclusive) of the subList.
     * @return a view of the specified range within this list.
     * @throws IndexOutOfBoundsException for an illegal endpoint index value
     *                                   (fromIndex &lt; 0 || toIndex &gt; size || fromIndex &gt; toIndex).
     */
    public List<E> subList(int fromIndex, int toIndex) {
        return list.subList(fromIndex, toIndex);
    }

    /**
     * Returns a list iterator of the elements in this list (in proper
     * sequence).
     *
     * @return a list iterator of the elements in this list (in proper
     *         sequence).
     */
    public ListIterator<E> listIterator() {
        return list.listIterator();
    }

    /**
     * Returns a list iterator of the elements in this list (in proper
     * sequence), starting at the specified position in this list.  The
     * specified index indicates the first element that would be returned by
     * an initial call to the <tt>next</tt> method.  An initial call to
     * the <tt>previous</tt> method would return the element with the
     * specified index minus one.
     *
     * @param index index of first element to be returned from the
     *              list iterator (by a call to the <tt>next</tt> method).
     * @return a list iterator of the elements in this list (in proper
     *         sequence), starting at the specified position in this list.
     * @throws IndexOutOfBoundsException if the index is out of range (index
     *                                   &lt; 0 || index &gt; size()).
     */
    public ListIterator<E> listIterator(int index) {
        return list.listIterator(index);
    }

    /**
     * Replaces the element at the specified position in this list with the
     * specified element (optional operation).
     *
     * @param index   index of element to replace.
     * @param element element to be stored at the specified position.
     * @return the element previously at the specified position.
     * @throws UnsupportedOperationException if the <tt>set</tt> method is not
     *                                       supported by this list.
     * @throws ClassCastException            if the class of the specified element
     *                                       prevents it from being added to this list.
     * @throws NullPointerException          if the specified element is null and
     *                                       this list does not support null elements.
     * @throws IllegalArgumentException      if some aspect of the specified
     *                                       element prevents it from being added to this list.
     * @throws IndexOutOfBoundsException     if the index is out of range
     *                                       (index &lt; 0 || index &gt;= size()).
     */
    public E set(int index, E element) {
        return list.set(index, element);
    }

    /**
     * Returns an array containing all of the elements in this list in proper
     * sequence; the runtime type of the returned array is that of the
     * specified array.  Obeys the general contract of the
     * <tt>Collection.toArray(Object[])</tt> method.
     *
     * @param a the array into which the elements of this list are to
     *          be stored, if it is big enough; otherwise, a new array of the
     *          same runtime type is allocated for this purpose.
     * @return an array containing the elements of this list.
     * @throws ArrayStoreException  if the runtime type of the specified array
     *                              is not a supertype of the runtime type of every element in
     *                              this list.
     * @throws NullPointerException if the specified array is <tt>null</tt>.
     */
    public <T> T[] toArray(T a[]) {
        return list.toArray(a);
    }

    /**
     * 返回数据集合总数
     *
     * @return 数据集合总数
     */
    public long getTotalCount() {
        return totalCount;
    }

    /**
     * 设置数据集合总数
     *
     * @param totalCount 数据集合总数
     */
    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    /**
     * 转换成字符串。
     */
    public String toString() {
        StringBuilder strBuf = new StringBuilder();
        strBuf.append("[");
        strBuf.append(" totalCount=").append(totalCount);
        strBuf.append(" list=").append(list);
        strBuf.append("]");
        return strBuf.toString();
    }

    /**
     * 返回当前Cached的页面的起始位置
     *
     * @return 当前Cached的页面的起始位置
     */
    public int getOffset() {
        return 0;
    }

    /**
     * 返回当前Cached的页面
     *
     * @return 当前Cached的页面
     */
    public PageList<E> getCached() {
        return this;
    }

    /**
     * 获取一个页面
     *
     * @param offset 起始位置
     * @param length 页面长度
     * @return 页面列表
     */
    public PageList<E> getPage(int offset, int length) {
        int size = size();
        if (offset < 0 || offset >= size) {
            throw new IllegalArgumentException("Invalid offset:" + offset);
        }
        if (length < 0) {
            throw new IllegalArgumentException("Invalid length:" + length);
        }
        int len = size - offset;
        if (length == Integer.MAX_VALUE) {//如果是没有限制长度的，那么直接进行Clone
            length = len;
        } else {
            if (length > len) {
                throw new IllegalArgumentException("No more items:" + length);
            }
        }
        //允许创建成内存数据
        ArrayList<E> list = new ArrayList<E>(length);
        list.addAll(this.list.subList(offset, offset + length));
        return new PageArrayList<E>(size, list);
    }
}